import { type NextRequest, NextResponse } from "next/server"
import { unlink, readdir, stat, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const EXPORTS_DIR = path.join(process.cwd(), "exports")

// Ensure exports directory exists
async function ensureExportsDir() {
  try {
    if (!existsSync(EXPORTS_DIR)) {
      await mkdir(EXPORTS_DIR, { recursive: true })
    }
  } catch (error) {
    console.error("Error creating exports directory:", error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureExportsDir()

    const { filenames } = await request.json()

    if (!filenames || !Array.isArray(filenames)) {
      return NextResponse.json({ error: "Missing or invalid filenames array" }, { status: 400 })
    }

    const results = []

    for (const filename of filenames) {
      try {
        const filePath = path.join(EXPORTS_DIR, filename)

        if (existsSync(filePath)) {
          await unlink(filePath)
          results.push({ filename, success: true })
        } else {
          results.push({ filename, success: false, error: "File not found" })
        }
      } catch (error) {
        results.push({ filename, success: false, error: "Failed to delete" })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
    })
  } catch (error) {
    console.error("Error in bulk delete:", error)
    return NextResponse.json({ error: "Failed to process bulk delete" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await ensureExportsDir()

    // Check if directory exists and is accessible
    if (!existsSync(EXPORTS_DIR)) {
      return NextResponse.json({
        storage: {
          totalFiles: 0,
          totalSize: "0 KB",
          totalSizeBytes: 0,
          fileTypes: {
            csv: 0,
            json: 0,
            other: 0,
          },
        },
      })
    }

    // Get storage statistics
    let files = []
    try {
      files = await readdir(EXPORTS_DIR)
    } catch (error) {
      console.error("Error reading exports directory:", error)
      // Return empty stats if directory can't be read
      return NextResponse.json({
        storage: {
          totalFiles: 0,
          totalSize: "0 KB",
          totalSizeBytes: 0,
          fileTypes: {
            csv: 0,
            json: 0,
            other: 0,
          },
        },
      })
    }

    let totalSize = 0
    const totalFiles = files.length

    const fileTypes = {
      csv: 0,
      json: 0,
      other: 0,
    }

    for (const file of files) {
      try {
        const filePath = path.join(EXPORTS_DIR, file)
        const stats = await stat(filePath)
        totalSize += stats.size

        const ext = path.extname(file).toLowerCase()
        if (ext === ".csv") {
          fileTypes.csv++
        } else if (ext === ".json") {
          fileTypes.json++
        } else {
          fileTypes.other++
        }
      } catch (error) {
        console.error(`Error getting stats for file ${file}:`, error)
        // Continue with other files if one fails
      }
    }

    return NextResponse.json({
      storage: {
        totalFiles,
        totalSize: (totalSize / 1024).toFixed(1) + " KB",
        totalSizeBytes: totalSize,
        fileTypes,
      },
    })
  } catch (error) {
    console.error("Error getting storage stats:", error)
    return NextResponse.json(
      {
        error: "Failed to get storage statistics",
        storage: {
          totalFiles: 0,
          totalSize: "0 KB",
          totalSizeBytes: 0,
          fileTypes: {
            csv: 0,
            json: 0,
            other: 0,
          },
        },
      },
      { status: 500 },
    )
  }
}
