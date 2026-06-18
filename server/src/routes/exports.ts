import { Router, Request, Response } from "express"
import {
  deleteExportFile,
  getStorageStats,
  readExportFile,
  saveExportFile,
} from "../lib/exports-store.js"
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
    const result = await saveExportFile(filename, data, contentType)
    
    // Save metadata to MongoDB
    const exportDoc = new Export({
      filename: result.filename,
      type: type || "Unknown",
      format: format || "UNKNOWN",
      size: result.size,
      records: records || 0,
      serverStored: true,
      userId: req.userId,
    })
    await exportDoc.save()
    
    return res.json({
      ...result,
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
      // Fetch from MongoDB instead of filesystem
      const exports = await Export.find({ userId: req.userId }).sort({ createdAt: -1 })
      
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

    // Still read physical file from disk when downloading
    const file = await readExportFile(filename)
    if (!file) {
      return res.status(404).json({ error: "File not found" })
    }

    res.setHeader("Content-Type", file.contentType)
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.setHeader("Content-Length", file.stats.size.toString())
    return res.send(file.fileContent)
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
    await Export.findOneAndDelete({ filename, userId: req.userId })
    
    // Delete physical file
    const deleted = await deleteExportFile(filename)
    if (!deleted) {
      return res.status(404).json({ error: "File not found on disk" })
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
        await Export.findOneAndDelete({ filename, userId: req.userId })
        const success = await deleteExportFile(filename)
        results.push({
          filename,
          success,
          ...(success ? {} : { error: "File not found on disk" }),
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

bulkRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const stats = await getStorageStats()
    return res.json(stats)
  } catch (error) {
    console.error("Error getting storage stats:", error)
    return res.status(500).json({
      error: "Failed to get storage statistics",
      ...emptyStorageStats(),
    })
  }
})

function emptyStorageStats() {
  return {
    storage: {
      totalFiles: 0,
      totalSize: "0 KB",
      totalSizeBytes: 0,
      fileTypes: { csv: 0, json: 0, other: 0 },
    },
  }
}

router.use("/bulk", bulkRouter)

export default router
