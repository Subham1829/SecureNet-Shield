import { Router, Request, Response } from "express"
import { Export } from "../models/Export.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// Apply auth middleware to all export routes
router.use(authMiddleware)

router.post("/", async (req: Request, res: Response) => {
  try {
    const { filename, data, contentType, type, format, records } = req.body
    if (!filename || data === undefined) {
      return res.status(400).json({ error: "Missing filename or data" })
    }
    
    const fileContent =
      contentType === "application/json" && typeof data !== "string"
        ? JSON.stringify(data, null, 2)
        : data
        
    const sizeBytes = Buffer.byteLength(fileContent, "utf8")
    const sizeKB = (sizeBytes / 1024).toFixed(1) + " KB"
    
    // Save metadata and data to MongoDB
    const exportDoc = new Export({
      filename,
      type: type || "Unknown",
      format: format || "UNKNOWN",
      size: sizeKB,
      records: records || 0,
      serverStored: true,
      data: fileContent,
      contentType: contentType,
      userId: req.userId,
    })
    await exportDoc.save()
    
    return res.json({
      success: true,
      filename,
      size: sizeKB,
      id: exportDoc._id,
      exportDate: exportDoc.createdAt,
    })
  } catch (error) {
    console.error("Error saving export file:", error)
    return res.status(500).json({ error: "Failed to save file" })
  }
})

router.get("/", async (req: Request, res: Response) => {
  try {
    const filename = req.query.filename as string | undefined
    const action = req.query.action as string | undefined

    if (action === "list") {
      // Fetch from MongoDB
      const exports = await Export.find({ userId: req.userId }).sort({ createdAt: -1 }).select("-data") // Exclude data to save bandwidth
      
      // Map it to match what the frontend expects
      const files = exports.map(exp => ({
        id: exp._id,
        filename: exp.filename,
        type: exp.type,
        format: exp.format,
        size: exp.size,
        records: exp.records,
        exportDate: exp.createdAt,
        status: exp.status,
        serverStored: exp.serverStored
      }))
      return res.json({ files })
    }

    if (!filename) {
      return res.status(400).json({ error: "Missing filename" })
    }

    // Read file from MongoDB
    const file = await Export.findOne({ filename, userId: req.userId })
    if (!file || !file.data) {
      return res.status(404).json({ error: "File not found" })
    }

    const cType = file.contentType || (filename.endsWith(".json") ? "application/json" : "text/csv")
    const fileContent = file.data
    const sizeBytes = Buffer.byteLength(fileContent, "utf8")

    res.setHeader("Content-Type", cType)
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.setHeader("Content-Length", sizeBytes.toString())
    return res.send(fileContent)
  } catch (error) {
    console.error("Error reading export file:", error)
    return res.status(500).json({ error: "Failed to read file" })
  }
})

router.delete("/", async (req: Request, res: Response) => {
  try {
    const filename = req.query.filename as string | undefined
    if (!filename) {
      return res.status(400).json({ error: "Missing filename" })
    }
    
    // Delete from MongoDB
    const deleted = await Export.findOneAndDelete({ filename, userId: req.userId })
    if (!deleted) {
      return res.status(404).json({ error: "File not found" })
    }
    return res.json({ success: true, message: "File deleted successfully" })
  } catch (error) {
    console.error("Error deleting export file:", error)
    return res.status(500).json({ error: "Failed to delete file" })
  }
})

const bulkRouter = Router()

bulkRouter.delete("/", async (req: Request, res: Response) => {
  try {
    const { filenames } = req.body
    if (!filenames || !Array.isArray(filenames)) {
      return res.status(400).json({ error: "Missing or invalid filenames array" })
    }

    const results = []
    for (const filename of filenames) {
      try {
        const deleted = await Export.findOneAndDelete({ filename, userId: req.userId })
        results.push({
          filename,
          success: !!deleted,
          ...(deleted ? {} : { error: "File not found" }),
        })
      } catch {
        results.push({ filename, success: false, error: "Failed to delete" })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return res.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount,
      },
    })
  } catch (error) {
    console.error("Error in bulk delete:", error)
    return res.status(500).json({ error: "Failed to process bulk delete" })
  }
})

bulkRouter.get("/", async (req: Request, res: Response) => {
  try {
    const exports = await Export.find({ userId: req.userId })
    let totalSizeBytes = 0
    const fileTypes = { csv: 0, json: 0, other: 0 }
    
    for (const exp of exports) {
      if (exp.data) {
        totalSizeBytes += Buffer.byteLength(exp.data, "utf8")
      }
      if (exp.format === "CSV") fileTypes.csv++
      else if (exp.format === "JSON") fileTypes.json++
      else fileTypes.other++
    }
    
    return res.json({
      storage: {
        totalFiles: exports.length,
        totalSize: (totalSizeBytes / 1024).toFixed(1) + " KB",
        totalSizeBytes,
        fileTypes,
      }
    })
  } catch (error) {
    console.error("Error getting storage stats:", error)
    return res.status(500).json({
      error: "Failed to get storage statistics",
      storage: { totalFiles: 0, totalSize: "0 KB", totalSizeBytes: 0, fileTypes: { csv: 0, json: 0, other: 0 } },
    })
  }
})

router.use("/bulk", bulkRouter)

export default router
