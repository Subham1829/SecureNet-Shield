export interface ExportFile {
  id: number
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
  private exportHistory: ExportFile[] = []

  private constructor() {
    // Load export history from localStorage on initialization
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("exportHistory")
      if (saved) {
        this.exportHistory = JSON.parse(saved)
      }
    }
  }

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService()
    }
    return ExportService.instance
  }

  private saveToLocalStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("exportHistory", JSON.stringify(this.exportHistory))
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

      // Save file to server
      const response = await fetch("/api/exports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `${filename}.${format.toLowerCase()}`,
          data: fileContent,
          contentType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save file to server")
      }

      const result = await response.json()

      // Create export record
      const exportFile: ExportFile = {
        id: Date.now(),
        filename: result.filename,
        type,
        format: format.toUpperCase(),
        size: result.size,
        records: data.length,
        exportDate: new Date().toISOString(),
        status: "completed",
        serverStored: true,
      }

      // Add to history
      this.exportHistory.unshift(exportFile)
      this.saveToLocalStorage()

      // Trigger download
      await this.downloadFile(exportFile.filename)

      return exportFile
    } catch (error) {
      console.error("Error saving export file:", error)

      // Create failed export record
      const exportFile: ExportFile = {
        id: Date.now(),
        filename: `${filename}.${format.toLowerCase()}`,
        type,
        format: format.toUpperCase(),
        size: "0 KB",
        records: data.length,
        exportDate: new Date().toISOString(),
        status: "failed",
        serverStored: false,
      }

      this.exportHistory.unshift(exportFile)
      this.saveToLocalStorage()

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
      const response = await fetch(`/api/exports?filename=${encodeURIComponent(filename)}`)

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

  async deleteExportFile(id: number): Promise<void> {
    const exportFile = this.exportHistory.find((exp) => exp.id === id)
    if (!exportFile) {
      throw new Error("Export file not found")
    }

    try {
      if (exportFile.serverStored) {
        const response = await fetch(`/api/exports?filename=${encodeURIComponent(exportFile.filename)}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete file from server")
        }
      }

      // Remove from history
      this.exportHistory = this.exportHistory.filter((exp) => exp.id !== id)
      this.saveToLocalStorage()
    } catch (error) {
      console.error("Error deleting export file:", error)
      throw error
    }
  }

  async deleteMultipleExports(ids: number[]): Promise<void> {
    const filesToDelete = this.exportHistory
      .filter((exp) => ids.includes(exp.id) && exp.serverStored)
      .map((exp) => exp.filename)

    try {
      if (filesToDelete.length > 0) {
        const response = await fetch("/api/exports/bulk", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filenames: filesToDelete }),
        })

        if (!response.ok) {
          throw new Error("Failed to delete files from server")
        }
      }

      // Remove from history
      this.exportHistory = this.exportHistory.filter((exp) => !ids.includes(exp.id))
      this.saveToLocalStorage()
    } catch (error) {
      console.error("Error deleting multiple export files:", error)
      throw error
    }
  }

  async clearAllExports(): Promise<void> {
    const serverStoredFiles = this.exportHistory.filter((exp) => exp.serverStored).map((exp) => exp.filename)

    try {
      if (serverStoredFiles.length > 0) {
        const response = await fetch("/api/exports/bulk", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filenames: serverStoredFiles }),
        })

        if (!response.ok) {
          throw new Error("Failed to delete files from server")
        }
      }

      // Clear history
      this.exportHistory = []
      this.saveToLocalStorage()
    } catch (error) {
      console.error("Error clearing all export files:", error)
      throw error
    }
  }

  async getStorageStats(): Promise<any> {
    try {
      const response = await fetch("/api/exports/bulk")
      if (!response.ok) {
        console.warn("Failed to get storage stats, using defaults")
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
      return await response.json()
    } catch (error) {
      console.error("Error getting storage stats:", error)
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

  getExportHistory(): ExportFile[] {
    return [...this.exportHistory]
  }

  getExportById(id: number): ExportFile | undefined {
    return this.exportHistory.find((exp) => exp.id === id)
  }

  getFilteredExports(searchTerm = "", typeFilter = ""): ExportFile[] {
    return this.exportHistory.filter((exp) => {
      const matchesSearch =
        exp.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !typeFilter || exp.type === typeFilter
      return matchesSearch && matchesType
    })
  }
}
