import { existsSync } from "fs"
import { mkdir, readFile, readdir, stat, unlink, writeFile } from "fs/promises"
import path from "path"

export const EXPORTS_DIR = path.join(process.cwd(), "exports")

export async function ensureExportsDir() {
  if (!existsSync(EXPORTS_DIR)) {
    await mkdir(EXPORTS_DIR, { recursive: true })
  }
}

export async function saveExportFile(filename: string, data: string, contentType: string) {
  await ensureExportsDir()
  const filePath = path.join(EXPORTS_DIR, filename)
  const fileContent =
    contentType === "application/json" && typeof data !== "string"
      ? JSON.stringify(data, null, 2)
      : data
  await writeFile(filePath, fileContent, "utf8")
  const stats = await stat(filePath)
  return {
    success: true,
    filename,
    size: (stats.size / 1024).toFixed(1) + " KB",
    path: filePath,
  }
}

export async function listExportFiles() {
  await ensureExportsDir()
  const files = await readdir(EXPORTS_DIR)
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(EXPORTS_DIR, file)
      const stats = await stat(filePath)
      return {
        filename: file,
        size: (stats.size / 1024).toFixed(1) + " KB",
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString(),
      }
    }),
  )
}

export async function readExportFile(filename: string) {
  const filePath = path.join(EXPORTS_DIR, filename)
  if (!existsSync(filePath)) {
    return null
  }
  const fileContent = await readFile(filePath, "utf8")
  const stats = await stat(filePath)
  const ext = path.extname(filename).toLowerCase()
  const contentType = ext === ".json" ? "application/json" : "text/csv"
  return { fileContent, stats, contentType }
}

export async function deleteExportFile(filename: string) {
  const filePath = path.join(EXPORTS_DIR, filename)
  if (!existsSync(filePath)) {
    return false
  }
  await unlink(filePath)
  return true
}

export async function getStorageStats() {
  await ensureExportsDir()
  if (!existsSync(EXPORTS_DIR)) {
    return emptyStorageStats()
  }

  let files: string[] = []
  try {
    files = await readdir(EXPORTS_DIR)
  } catch {
    return emptyStorageStats()
  }

  let totalSize = 0
  const fileTypes = { csv: 0, json: 0, other: 0 }

  for (const file of files) {
    try {
      const filePath = path.join(EXPORTS_DIR, file)
      const stats = await stat(filePath)
      totalSize += stats.size
      const ext = path.extname(file).toLowerCase()
      if (ext === ".csv") fileTypes.csv++
      else if (ext === ".json") fileTypes.json++
      else fileTypes.other++
    } catch {
      // skip unreadable files
    }
  }

  return {
    storage: {
      totalFiles: files.length,
      totalSize: (totalSize / 1024).toFixed(1) + " KB",
      totalSizeBytes: totalSize,
      fileTypes,
    },
  }
}

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
