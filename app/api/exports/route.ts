import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, unlink, readdir, stat, mkdir } from "fs/promises"
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

export async function POST(request: NextRequest) {
  try {
    await ensureExportsDir()

    const { filename, data, contentType } = await request.json()

    if (!filename || !data) {
      return NextResponse.json({ error: "Missing filename or data" }, { status: 400 })
    }

    const filePath = path.join(EXPORTS_DIR, filename)

    // Convert data to appropriate format
    let fileContent: string
    if (contentType === "application/json") {
      fileContent = typeof data === "string" ? data : JSON.stringify(data, null, 2)
    } else {
      fileContent = data
    }

    await writeFile(filePath, fileContent, "utf8")

    // Get file stats
    const stats = await stat(filePath)
    const fileSize = (stats.size / 1024).toFixed(1) + " KB"

    return NextResponse.json({
      success: true,
      filename,
      size: fileSize,
      path: filePath,
    })
  } catch (error) {
    console.error("Error saving export file:", error)
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    const action = searchParams.get("action")

    if (action === "list") {
      // List all export files
      const files = await readdir(EXPORTS_DIR)
      const fileDetails = await Promise.all(
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

      return NextResponse.json({ files: fileDetails })
    }

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 })
    }

    const filePath = path.join(EXPORTS_DIR, filename)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileContent = await readFile(filePath, "utf8")
    const stats = await stat(filePath)

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === ".json" ? "application/json" : "text/csv"

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": stats.size.toString(),
      },
    })
  } catch (error) {
    console.error("Error reading export file:", error)
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 })
    }

    const filePath = path.join(EXPORTS_DIR, filename)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    await unlink(filePath)

    return NextResponse.json({ success: true, message: "File deleted successfully" })
  } catch (error) {
    console.error("Error deleting export file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
