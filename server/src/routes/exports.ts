import { Router } from "express"
import {
  deleteExportFile,
  getStorageStats,
  listExportFiles,
  readExportFile,
  saveExportFile,
} from "../lib/exports-store.js"

const router = Router()

router.post("/", async (req, res) => {
  try {
    const { filename, data, contentType } = req.body
    if (!filename || data === undefined) {
      return res.status(400).json({ error: "Missing filename or data" })
    }
    const result = await saveExportFile(filename, data, contentType)
    return res.json(result)
  } catch (error) {
    console.error("Error saving export file:", error)
    return res.status(500).json({ error: "Failed to save file" })
  }
})

router.get("/", async (req, res) => {
  try {
    const filename = req.query.filename as string | undefined
    const action = req.query.action as string | undefined

    if (action === "list") {
      const files = await listExportFiles()
      return res.json({ files })
    }

    if (!filename) {
      return res.status(400).json({ error: "Missing filename" })
    }

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

router.delete("/", async (req, res) => {
  try {
    const filename = req.query.filename as string | undefined
    if (!filename) {
      return res.status(400).json({ error: "Missing filename" })
    }
    const deleted = await deleteExportFile(filename)
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

bulkRouter.delete("/", async (req, res) => {
  try {
    const { filenames } = req.body
    if (!filenames || !Array.isArray(filenames)) {
      return res.status(400).json({ error: "Missing or invalid filenames array" })
    }

    const results = []
    for (const filename of filenames) {
      try {
        const success = await deleteExportFile(filename)
        results.push({
          filename,
          success,
          ...(success ? {} : { error: "File not found" }),
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

bulkRouter.get("/", async (_req, res) => {
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
