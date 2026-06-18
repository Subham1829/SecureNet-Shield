import { apiUrl } from "./api"

export interface ExportFile {
  id: string
  filename: string
  type: string
  format: string
  size: string
  records: number
  exportDate: string
  status: "completed" | "failed" | "processing"
  serverStored: boolean
}

export class ExportService {
  private static instance: ExportService

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService()
    }
    return ExportService.instance
  }

  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  }

  async getExportHistory(): Promise<ExportFile[]> {
    try {
      const response = await fetch(apiUrl("/api/exports?action=list"), {
        headers: this.getAuthHeaders()
      })
      if (!response.ok) {
        throw new Error("Failed to fetch export history")
      }
      const data = await response.json()
      return data.files || []
    } catch (error) {
      console.error("Error fetching export history:", error)
      return []
    }
  }

  async saveExportFile(data: any[], filename: string, type: string, format: string): Promise<ExportFile> {
    try {
      let fileContent: string
      let contentType: string

      if (format.toLowerCase() === "csv") {
        fileContent = this.convertToCSV(data)
        contentType = "text/csv"
      } else {
        fileContent = JSON.stringify(data, null, 2)
        contentType = "application/json"
      }

      // Save file and metadata to server
      const response = await fetch(apiUrl("/api/exports"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          filename: `${filename}.${format.toLowerCase()}`,
          data: fileContent,
          contentType,
          type,
          format: format.toUpperCase(),
          records: data.length
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save file to server")
      }

      const result = await response.json()

      const exportFile: ExportFile = {
        id: result.id,
        filename: result.filename,
        type,
        format: format.toUpperCase(),
        size: result.size,
        records: data.length,
        exportDate: result.exportDate || new Date().toISOString(),
        status: "completed",
        serverStored: true,
      }

      // Trigger download
      await this.downloadFile(exportFile.filename)

      return exportFile
    } catch (error) {
      console.error("Error saving export file:", error)
      throw error
    }
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value
          })
          .join(","),
      ),
    ].join("\n")

    return csvContent
  }

  async downloadFile(filename: string): Promise<void> {
    try {
      const response = await fetch(apiUrl(`/api/exports?filename=${encodeURIComponent(filename)}`), {
        headers: this.getAuthHeaders() // We don't send auth token in fetch if we are making it download directly via DOM link usually, but for fetch blob we do.
      })

      if (!response.ok) {
        throw new Error("Failed to download file")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading file:", error)
      throw error
    }
  }

  async deleteExportFile(filename: string): Promise<void> {
    try {
      const response = await fetch(apiUrl(`/api/exports?filename=${encodeURIComponent(filename)}`), {
        method: "DELETE",
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error("Failed to delete file from server")
      }
    } catch (error) {
      console.error("Error deleting export file:", error)
      throw error
    }
  }

  async deleteMultipleExports(filenames: string[]): Promise<void> {
    try {
      if (filenames.length > 0) {
        const response = await fetch(apiUrl("/api/exports/bulk"), {
          method: "DELETE",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ filenames }),
        })

        if (!response.ok) {
          throw new Error("Failed to delete files from server")
        }
      }
    } catch (error) {
      console.error("Error deleting multiple export files:", error)
      throw error
    }
  }

  async clearAllExports(filenames: string[]): Promise<void> {
    return this.deleteMultipleExports(filenames)
  }

  async getStorageStats(): Promise<any> {
    try {
      const response = await fetch(apiUrl("/api/exports/bulk"), {
        headers: this.getAuthHeaders()
      })
      if (!response.ok) {
        console.warn("Failed to get storage stats, using defaults")
        return this.getEmptyStorageStats()
      }
      return await response.json()
    } catch (error) {
      console.error("Error getting storage stats:", error)
      return this.getEmptyStorageStats()
    }
  }

  private getEmptyStorageStats() {
    return {
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
    }
  }
}
