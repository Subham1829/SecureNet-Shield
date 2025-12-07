"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Shield,
  Globe,
  Copy,
  RefreshCw,
  Ban,
  CheckCircle,
  AlertTriangle,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  MapPin,
  Clock,
  Wifi,
  Network,
  Info,
  Activity,
  Users,
  Server,
  Zap,
  TrendingUp,
  Eye,
  Download,
  FileText,
  TableIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

// Import the export service at the top
import { ExportService } from "@/lib/export-service"

export default function DashboardPage() {
  const [ipInput, setIpInput] = useState("")
  const [generatedIp, setGeneratedIp] = useState("")
  const [autoBlock, setAutoBlock] = useState(true)
  const [ipAnalysis, setIpAnalysis] = useState<any>(null)
  const [ipLocation, setIpLocation] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const [selectedIpType, setSelectedIpType] = useState("all")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Dashboard stats
  const [stats, setStats] = useState({
    totalIPs: 1247,
    blockedIPs: 89,
    threatsBlocked: 156,
    uptime: 99.9,
  })

  // Replace the export history state and functions with:
  const exportService = ExportService.getInstance()
  const [exportHistory, setExportHistory] = useState(exportService.getExportHistory())
  const [selectedExports, setSelectedExports] = useState<number[]>([])
  const [exportFilter, setExportFilter] = useState("")
  const [exportTypeFilter, setExportTypeFilter] = useState("all")
  const [storageStats, setStorageStats] = useState<any>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Add useEffect to load storage stats
  useEffect(() => {
    loadStorageStats()
  }, [])

  const loadStorageStats = async () => {
    const stats = await exportService.getStorageStats()
    setStorageStats(stats)
  }

  const refreshExportHistory = () => {
    setExportHistory(exportService.getExportHistory())
    loadStorageStats()
  }

  const validateIPFormat = (ip: string) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  const analyzeIP = async () => {
    if (!validateIPFormat(ipInput)) {
      alert("Please enter a valid IP address format")
      return
    }

    setIsAnalyzing(true)

    // Simulate API call delay
    setTimeout(() => {
      const analysis = {
        ip: ipInput,
        type: ipInput.includes(":") ? "IPv6" : "IPv4",
        status: Math.random() > 0.3 ? "Valid" : "Invalid",
        category: getIPCategory(ipInput),
        location: {
          country: "United States",
          region: "California",
          city: "San Francisco",
          latitude: 37.7749,
          longitude: -122.4194,
          timezone: "America/Los_Angeles",
          isp: "Cloudflare Inc.",
          organization: "Cloudflare",
          postal: "94102",
        },
        security: {
          threat: Math.random() > 0.8 ? "Suspicious" : "Clean",
          blacklisted: Math.random() > 0.9,
          proxy: Math.random() > 0.85,
          vpn: Math.random() > 0.8,
          tor: Math.random() > 0.95,
          reputation: Math.floor(Math.random() * 100),
        },
        network: {
          asn: "AS13335",
          domain: "cloudflare.com",
          usage: "hosting",
        },
      }

      setIpAnalysis(analysis)
      setIpLocation(analysis.location)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getIPCategory = (ip: string) => {
    if (ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
      return "Private"
    } else if (ip.startsWith("127.")) {
      return "Loopback"
    } else if (ip.startsWith("224.") || ip.startsWith("239.")) {
      return "Multicast"
    } else {
      return "Public"
    }
  }

  const generateIP = (type: string) => {
    let ip = ""
    if (type === "ipv4") {
      ip = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".")
    } else if (type === "ipv6") {
      ip = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 65536)
          .toString(16)
          .padStart(4, "0"),
      ).join(":")
    } else if (type === "private") {
      const privateRanges = ["192.168.", "10.", "172.16."]
      const range = privateRanges[Math.floor(Math.random() * privateRanges.length)]
      if (range === "192.168.") {
        ip = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
      } else if (range === "10.") {
        ip = `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
      } else {
        ip = `172.16.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
      }
    }
    setGeneratedIp(ip)
  }

  const blockIP = () => {
    if (!ipInput || !blockReason) {
      alert("Please enter an IP address and reason for blocking")
      return
    }

    alert(`IP ${ipInput} has been blocked successfully. Reason: ${blockReason}`)
    setBlockReason("")
    setStats((prev) => ({ ...prev, blockedIPs: prev.blockedIPs + 1 }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const blockedIPs = [
    {
      ip: "192.168.1.100",
      reason: "Suspicious activity",
      date: "2024-01-15",
      status: "Blocked",
      location: "Unknown",
      threat: "High",
    },
    {
      ip: "10.0.0.50",
      reason: "Malware detected",
      date: "2024-01-14",
      status: "Blocked",
      location: "Russia",
      threat: "Critical",
    },
    {
      ip: "172.16.0.25",
      reason: "Brute force attempt",
      date: "2024-01-13",
      status: "Blocked",
      location: "China",
      threat: "High",
    },
    {
      ip: "203.0.113.45",
      reason: "Spam source",
      date: "2024-01-12",
      status: "Blocked",
      location: "Nigeria",
      threat: "Medium",
    },
    {
      ip: "198.51.100.30",
      reason: "DDoS attack",
      date: "2024-01-11",
      status: "Blocked",
      location: "Unknown",
      threat: "Critical",
    },
  ]

  const ipTypes = [
    {
      type: "Public IP",
      description: "Globally routable addresses assigned by ISPs",
      example: "8.8.8.8",
      details: "Used for internet communication, visible to external networks",
      icon: Globe,
    },
    {
      type: "Private IP",
      description: "Local network addresses (RFC 1918)",
      example: "192.168.1.1",
      details: "Used within local networks, not routable on the internet",
      icon: Wifi,
    },
    {
      type: "Static IP",
      description: "Permanently assigned IP address",
      example: "203.0.113.1",
      details: "Doesn't change, ideal for servers and services",
      icon: Server,
    },
    {
      type: "Dynamic IP",
      description: "Temporarily assigned IP address",
      example: "Dynamic assignment",
      details: "Changes periodically, common for home users",
      icon: RefreshCw,
    },
    {
      type: "Loopback IP",
      description: "Local machine reference",
      example: "127.0.0.1",
      details: "Used for testing and local services",
      icon: Activity,
    },
    {
      type: "Reserved IP",
      description: "Special purpose addresses",
      example: "0.0.0.0",
      details: "Reserved for specific network functions",
      icon: Shield,
    },
  ]

  const networkTypes = [
    {
      type: "LAN",
      fullForm: "Local Area Network",
      description: "Small area network (office, home)",
      coverage: "Up to 1 km",
      speed: "10 Mbps - 10 Gbps",
      example: "Office network, Home WiFi",
      icon: Wifi,
    },
    {
      type: "PAN",
      fullForm: "Personal Area Network",
      description: "Single person device range",
      coverage: "Up to 10 meters",
      speed: "1-3 Mbps",
      example: "Bluetooth, USB connections",
      icon: Users,
    },
    {
      type: "WAN",
      fullForm: "Wide Area Network",
      description: "Large geographical area",
      coverage: "Countries/Continents",
      speed: "1.5 Mbps - 10 Gbps",
      example: "Internet, Corporate networks",
      icon: Globe,
    },
    {
      type: "MAN",
      fullForm: "Metropolitan Area Network",
      description: "Covers a city or town",
      coverage: "5-50 km",
      speed: "10 Mbps - 1 Gbps",
      example: "City-wide networks, Cable TV",
      icon: MapPin,
    },
    {
      type: "WLAN",
      fullForm: "Wireless Local Area Network",
      description: "Wireless version of LAN",
      coverage: "Up to 100 meters",
      speed: "11 Mbps - 1 Gbps",
      example: "WiFi networks",
      icon: Wifi,
    },
    {
      type: "VPN",
      fullForm: "Virtual Private Network",
      description: "Secure connection over public network",
      coverage: "Global",
      speed: "Depends on connection",
      example: "Remote work connections",
      icon: Shield,
    },
  ]

  const backendLanguages = [
    {
      name: "Node.js",
      language: "JavaScript",
      description: "Very popular for web apps with huge ecosystem",
      popularity: "Very High",
      features: [
        "Express.js for server framework",
        "bcrypt for password hashing",
        "jsonwebtoken for authentication",
        "Easy API integration",
        "Real-time capabilities with Socket.io",
      ],
      databases: ["MongoDB", "MySQL", "PostgreSQL", "Redis"],
      bestFor: "Real-time features (like blocking suspicious IPs live)",
      pros: [
        "Same language for frontend and backend",
        "Huge npm ecosystem",
        "Excellent for real-time applications",
        "Fast development cycle",
        "Great community support",
      ],
      cons: ["Single-threaded (CPU intensive tasks)", "Callback complexity", "Rapid ecosystem changes"],
      useCase: "IP blocking with real-time monitoring and WebSocket updates",
      icon: Server,
      color: "green",
    },
    {
      name: "Python",
      language: "Python",
      description: "Excellent for data analysis and machine learning",
      popularity: "Very High",
      features: [
        "Django/Flask frameworks",
        "NumPy/Pandas for data analysis",
        "Scikit-learn for ML threat detection",
        "Requests for API calls",
        "SQLAlchemy for database ORM",
      ],
      databases: ["PostgreSQL", "MySQL", "SQLite", "MongoDB"],
      bestFor: "AI-powered threat detection and data analysis",
      pros: [
        "Great for data science and ML",
        "Clean, readable syntax",
        "Extensive libraries",
        "Strong community",
        "Excellent for prototyping",
      ],
      cons: ["Slower execution speed", "GIL limitations for threading", "Higher memory usage"],
      useCase: "Intelligent IP threat analysis using machine learning algorithms",
      icon: Activity,
      color: "blue",
    },
    {
      name: "Go",
      language: "Go",
      description: "High-performance concurrent applications",
      popularity: "High",
      features: [
        "Gin/Echo web frameworks",
        "Built-in concurrency (goroutines)",
        "Fast compilation",
        "Static binary deployment",
        "Excellent HTTP performance",
      ],
      databases: ["PostgreSQL", "MySQL", "Redis", "MongoDB"],
      bestFor: "High-throughput IP filtering and concurrent request handling",
      pros: ["Excellent performance", "Built-in concurrency", "Fast compilation", "Small binary size", "Strong typing"],
      cons: ["Smaller ecosystem", "Verbose error handling", "Less flexible than dynamic languages"],
      useCase: "High-performance IP blocking service handling millions of requests",
      icon: Zap,
      color: "cyan",
    },
    {
      name: "Java",
      language: "Java",
      description: "Enterprise-grade applications with Spring ecosystem",
      popularity: "Very High",
      features: [
        "Spring Boot framework",
        "Spring Security for auth",
        "Hibernate ORM",
        "Maven/Gradle build tools",
        "JVM ecosystem",
      ],
      databases: ["PostgreSQL", "MySQL", "Oracle", "MongoDB"],
      bestFor: "Enterprise IP management systems with complex business logic",
      pros: ["Mature ecosystem", "Strong typing", "Excellent tooling", "Platform independent", "Great for large teams"],
      cons: ["Verbose syntax", "Slower startup times", "Memory overhead", "Complex configuration"],
      useCase: "Enterprise-scale IP blocking with complex rule engines and reporting",
      icon: Shield,
      color: "orange",
    },
    {
      name: "C#/.NET",
      language: "C#",
      description: "Microsoft ecosystem with excellent tooling",
      popularity: "High",
      features: [
        "ASP.NET Core framework",
        "Entity Framework ORM",
        "SignalR for real-time",
        "Azure integration",
        "Strong typing with generics",
      ],
      databases: ["SQL Server", "PostgreSQL", "MySQL", "CosmosDB"],
      bestFor: "Windows-centric environments and Azure cloud deployments",
      pros: [
        "Excellent tooling (Visual Studio)",
        "Strong type system",
        "Great performance",
        "Rich ecosystem",
        "Cross-platform (.NET Core)",
      ],
      cons: ["Microsoft ecosystem dependency", "Licensing costs", "Less popular in startups"],
      useCase: "Corporate IP security systems integrated with Active Directory",
      icon: Network,
      color: "purple",
    },
    {
      name: "Rust",
      language: "Rust",
      description: "Memory-safe systems programming with high performance",
      popularity: "Growing",
      features: [
        "Actix-web/Warp frameworks",
        "Memory safety without GC",
        "Excellent concurrency",
        "Zero-cost abstractions",
        "Cargo package manager",
      ],
      databases: ["PostgreSQL", "MySQL", "Redis", "SQLite"],
      bestFor: "Ultra-high performance IP filtering with memory safety",
      pros: ["Memory safety", "Excellent performance", "Great concurrency", "Growing ecosystem", "No runtime overhead"],
      cons: ["Steep learning curve", "Smaller ecosystem", "Longer development time", "Complex borrow checker"],
      useCase: "High-performance network security appliances and edge computing",
      icon: Activity,
      color: "red",
    },
  ]

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-900 border-r border-slate-700">
      <div className="flex h-16 items-center border-b border-slate-700 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-white">IP Guardian</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-3">
          <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Activity className="mr-3 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/feedback">
              <MessageSquare className="mr-3 h-4 w-4" />
              Feedback
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>
      <div className="border-t border-slate-700 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          asChild
        >
          <Link href="/auth">
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  )

  // Updated export functions
  const exportToCSV = async (data: any[], filename: string, type = "Data") => {
    if (data.length === 0) {
      alert("No data to export")
      return
    }

    setIsExporting(true)
    try {
      await exportService.saveExportFile(data, filename, type, "CSV")
      refreshExportHistory()
      alert("Export completed successfully!")
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = async (data: any[], filename: string, type = "Data") => {
    if (data.length === 0) {
      alert("No data to export")
      return
    }

    setIsExporting(true)
    try {
      await exportService.saveExportFile(data, filename, type, "JSON")
      refreshExportHistory()
      alert("Export completed successfully!")
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const exportBlockedIPs = async (format: "csv" | "json") => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const filename = `blocked-ips-${timestamp}`

    if (format === "csv") {
      await exportToCSV(blockedIPs, filename, "Blocked IPs")
    } else {
      await exportToJSON(blockedIPs, filename, "Blocked IPs")
    }
  }

  const generateSecurityReport = () => {
    // Dummy data for the security report
    const report = {
      reportDate: new Date().toLocaleDateString(),
      summary: {
        totalIPsAnalyzed: stats.totalIPs,
        totalBlockedIPs: stats.blockedIPs,
        totalThreatsBlocked: stats.threatsBlocked,
        systemUptime: stats.uptime,
        reportPeriod: "Last 24 Hours",
      },
      threatAnalysis: {
        highThreatIPs: 12,
        mediumThreatIPs: 45,
        autoBlockedCount: 5,
        manualBlockedCount: 3,
      },
    }
    return report
  }

  const exportSecurityReport = async (format: "csv" | "json") => {
    const report = generateSecurityReport()
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const filename = `security-report-${timestamp}`

    if (format === "csv") {
      const flatReport = [
        {
          reportType: "Summary",
          reportDate: report.reportDate,
          totalIPsAnalyzed: report.summary.totalIPsAnalyzed,
          totalBlockedIPs: report.summary.totalBlockedIPs,
          totalThreatsBlocked: report.summary.totalThreatsBlocked,
          systemUptime: report.summary.systemUptime,
          reportPeriod: report.summary.reportPeriod,
          highThreatIPs: report.threatAnalysis.highThreatIPs,
          mediumThreatIPs: report.threatAnalysis.mediumThreatIPs,
          autoBlockedCount: report.threatAnalysis.autoBlockedCount,
          manualBlockedCount: report.threatAnalysis.manualBlockedCount,
        },
      ]
      await exportToCSV(flatReport, filename, "Security Report")
    } else {
      await exportToJSON([report], filename, "Security Report")
    }
  }

  // Updated export history management functions
  const deleteExportHistory = async (id: number) => {
    try {
      await exportService.deleteExportFile(id)
      refreshExportHistory()
      setSelectedExports((prev) => prev.filter((selectedId) => selectedId !== id))
      alert("Export file deleted successfully!")
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete export file. Please try again.")
    }
  }

  const deleteSelectedExports = async () => {
    if (selectedExports.length === 0) return

    try {
      await exportService.deleteMultipleExports(selectedExports)
      refreshExportHistory()
      setSelectedExports([])
      alert(`${selectedExports.length} export files deleted successfully!`)
    } catch (error) {
      console.error("Bulk delete failed:", error)
      alert("Failed to delete export files. Please try again.")
    }
  }

  const clearAllExportHistory = async () => {
    if (!confirm("Are you sure you want to delete all export files? This action cannot be undone.")) {
      return
    }

    try {
      await exportService.clearAllExports()
      refreshExportHistory()
      setSelectedExports([])
      alert("All export files deleted successfully!")
    } catch (error) {
      console.error("Clear all failed:", error)
      alert("Failed to delete all export files. Please try again.")
    }
  }

  const downloadExportFile = async (filename: string) => {
    try {
      await exportService.downloadFile(filename)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download file. The file may no longer exist on the server.")
    }
  }

  const getFilteredExports = () => {
    return exportService.getFilteredExports(exportFilter, exportTypeFilter === "all" ? "" : exportTypeFilter)
  }

  const formatFileSize = (size: string) => size

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const selectAllExports = () => {
    const filteredExports = getFilteredExports()
    const allIds = filteredExports.map((exp) => exp.id)
    setSelectedExports(allIds)
  }

  const toggleExportSelection = (exportId: number) => {
    setSelectedExports((prev) => {
      if (prev.includes(exportId)) {
        return prev.filter((id) => id !== exportId)
      } else {
        return [...prev, exportId]
      }
    })
  }

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-slate-900">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 bg-slate-900">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <div>
                <h1 className="text-2xl font-bold text-white">Network Security Dashboard</h1>
                <p className="text-slate-400">Advanced IP analysis and threat protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportSecurityReport("json")}
                className="border-slate-600 text-slate-300 hover:text-white hover:border-blue-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Quick Export
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-slate-400">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total IPs Analyzed</p>
                    <p className="text-2xl font-bold text-white">{stats.totalIPs.toLocaleString()}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                    <Eye className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-400" />
                  <span className="text-green-400">+12%</span>
                  <span className="text-slate-400 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Blocked IPs</p>
                    <p className="text-2xl font-bold text-white">{stats.blockedIPs}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <Ban className="h-6 w-6 text-red-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <AlertTriangle className="mr-1 h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400">+5</span>
                  <span className="text-slate-400 ml-1">today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Threats Blocked</p>
                    <p className="text-2xl font-bold text-white">{stats.threatsBlocked}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <CheckCircle className="mr-1 h-4 w-4 text-green-400" />
                  <span className="text-green-400">All blocked</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">System Uptime</p>
                    <p className="text-2xl font-bold text-white">{stats.uptime}%</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Activity className="mr-1 h-4 w-4 text-green-400" />
                  <span className="text-green-400">Excellent</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <Tabs defaultValue="analysis" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700 text-slate-400">
              <TabsTrigger value="analysis" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Analysis
              </TabsTrigger>
              <TabsTrigger value="blocking" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Block
              </TabsTrigger>
              <TabsTrigger
                value="generator"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
              >
                Generate
              </TabsTrigger>
              <TabsTrigger value="location" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Location
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Reports
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Details
              </TabsTrigger>
            </TabsList>

            {/* 1. IP Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Search className="h-5 w-5 text-blue-400" />
                    IP Address Analysis & Validation
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter any IP address to validate format and analyze its properties
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter IP address (IPv4: 192.168.1.1 or IPv6: 2001:db8::1)"
                      value={ipInput}
                      onChange={(e) => setIpInput(e.target.value)}
                      className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                    <Button
                      onClick={analyzeIP}
                      disabled={!ipInput || isAnalyzing}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        "Analyze IP"
                      )}
                    </Button>
                  </div>

                  {ipAnalysis && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card className="bg-slate-800/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">IP Address:</span>
                            <span className="font-mono text-white">{ipAnalysis.ip}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Type:</span>
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              {ipAnalysis.type}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Status:</span>
                            <Badge variant={ipAnalysis.status === "Valid" ? "default" : "destructive"}>
                              {ipAnalysis.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Category:</span>
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                              {ipAnalysis.category}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Security Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Threat Level:</span>
                            <Badge variant={ipAnalysis.security.threat === "Clean" ? "default" : "destructive"}>
                              {ipAnalysis.security.threat}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Reputation:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={ipAnalysis.security.reputation} className="w-16 h-2 bg-slate-700" />
                              <span className="text-sm text-slate-400">{ipAnalysis.security.reputation}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Blacklisted:</span>
                            <Badge variant={ipAnalysis.security.blacklisted ? "destructive" : "default"}>
                              {ipAnalysis.security.blacklisted ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Proxy/VPN:</span>
                            <Badge
                              variant={ipAnalysis.security.proxy || ipAnalysis.security.vpn ? "secondary" : "default"}
                            >
                              {ipAnalysis.security.proxy || ipAnalysis.security.vpn ? "Detected" : "None"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Network Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">ASN:</span>
                            <span className="font-mono text-white">{ipAnalysis.network.asn}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Domain:</span>
                            <span className="text-white">{ipAnalysis.network.domain}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Usage:</span>
                            <Badge variant="outline" className="border-purple-500 text-purple-400">
                              {ipAnalysis.network.usage}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 3. IP Blocking Tab */}
            <TabsContent value="blocking" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Ban className="h-5 w-5 text-red-400" />
                      Block Fake/Malicious IPs
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Manually block suspicious IP addresses or enable auto-blocking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div>
                        <Label htmlFor="auto-block" className="text-slate-300 font-medium">
                          Auto-block suspicious IPs
                        </Label>
                        <p className="text-sm text-slate-400">Automatically block IPs with suspicious behavior</p>
                      </div>
                      <Switch
                        id="auto-block"
                        checked={autoBlock}
                        onCheckedChange={setAutoBlock}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <Separator className="bg-slate-700" />

                    <div className="space-y-3">
                      <Label className="text-slate-300 font-medium">Manual IP Blocking</Label>
                      <Input
                        placeholder="Enter IP address to block"
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500"
                      />
                      <Textarea
                        placeholder="Reason for blocking (required)"
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        className="min-h-[80px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500"
                      />
                      <Button
                        onClick={blockIP}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        disabled={!ipInput || !blockReason}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Block IP Address
                      </Button>
                    </div>

                    <Alert className="bg-yellow-900/20 border-yellow-500/50">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-400">
                        <strong>Today's Activity:</strong> 3 suspicious IPs detected, 15 automatically blocked
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Recently Blocked IPs</CardTitle>
                        <CardDescription className="text-slate-400">
                          View and manage blocked IP addresses
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportBlockedIPs("csv")}
                          disabled={isExporting}
                          className="border-slate-600 text-slate-300 hover:text-white hover:border-green-500"
                        >
                          <TableIcon className="mr-2 h-4 w-4" />
                          {isExporting ? "Exporting..." : "CSV"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportBlockedIPs("json")}
                          disabled={isExporting}
                          className="border-slate-600 text-slate-300 hover:text-white hover:border-blue-500"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {isExporting ? "Exporting..." : "JSON"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {blockedIPs.map((ip, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-white">{ip.ip}</span>
                              <Badge
                                variant={
                                  ip.threat === "Critical"
                                    ? "destructive"
                                    : ip.threat === "High"
                                      ? "destructive"
                                      : ip.threat === "Medium"
                                        ? "secondary"
                                        : "default"
                                }
                                className="text-xs"
                              >
                                {ip.threat}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-400">{ip.reason}</div>
                            <div className="text-xs text-slate-500">
                              {ip.date} • {ip.location}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                          >
                            Unblock
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Total blocked: {blockedIPs.length} IPs</span>
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 4. IP Generator Tab */}
            <TabsContent value="generator" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <RefreshCw className="h-5 w-5 text-green-400" />
                    Generate New IP Addresses
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Generate random IP addresses for testing, learning, and development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-3 md:grid-cols-3">
                    <Button
                      onClick={() => generateIP("ipv4")}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-blue-500"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Generate IPv4
                    </Button>
                    <Button
                      onClick={() => generateIP("ipv6")}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-purple-500"
                    >
                      <Network className="mr-2 h-4 w-4" />
                      Generate IPv6
                    </Button>
                    <Button
                      onClick={() => generateIP("private")}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-green-500"
                    >
                      <Wifi className="mr-2 h-4 w-4" />
                      Generate Private IP
                    </Button>
                  </div>

                  {generatedIp && (
                    <Card className="bg-slate-800/50 border-slate-600">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Generated IP:</span>
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              {generatedIp.includes(":") ? "IPv6" : "IPv4"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                            <span className="flex-1 font-mono text-lg text-white">{generatedIp}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(generatedIp)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Category:</span>
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                              {getIPCategory(generatedIp)} IP
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. Location Tab */}
            <TabsContent value="location" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MapPin className="h-5 w-5 text-green-400" />
                    IP Geolocation Lookup
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Find the geographical location and ISP information of any IP address
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ipLocation ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-slate-800/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Country:</span>
                            <span className="text-white">{ipLocation.country}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Region:</span>
                            <span className="text-white">{ipLocation.region}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">City:</span>
                            <span className="text-white">{ipLocation.city}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Postal Code:</span>
                            <span className="text-white">{ipLocation.postal}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Coordinates:</span>
                            <span className="font-mono text-white">
                              {ipLocation.latitude}, {ipLocation.longitude}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/50 border-slate-600">
                        <CardHeader>
                          <CardTitle className="text-lg text-white">Network Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">ISP:</span>
                            <span className="text-white">{ipLocation.isp}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Organization:</span>
                            <span className="text-white">{ipLocation.organization}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-300">Timezone:</span>
                            <span className="flex items-center gap-1 text-white">
                              <Clock className="h-4 w-4 text-blue-400" />
                              {ipLocation.timezone}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="h-16 w-16 mx-auto text-slate-600 mb-4" />
                      <p className="text-slate-400 text-lg">
                        Analyze an IP address first to see its location information
                      </p>
                      <p className="text-slate-500 text-sm mt-2">Use the IP Analysis tab to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 8. Backend Languages Tab */}
            <TabsContent value="backend" className="space-y-6">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Server className="h-5 w-5 text-green-400" />
                    Backend Languages for IP Blocking Applications
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Choose the right backend technology for your IP security and network monitoring needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {backendLanguages.map((backend, index) => {
                      const IconComponent = backend.icon
                      const colorClasses = {
                        green: "from-green-500/20 to-emerald-500/20 text-green-400",
                        blue: "from-blue-500/20 to-indigo-500/20 text-blue-400",
                        cyan: "from-cyan-500/20 to-teal-500/20 text-cyan-400",
                        orange: "from-orange-500/20 to-red-500/20 text-orange-400",
                        purple: "from-purple-500/20 to-violet-500/20 text-purple-400",
                        red: "from-red-500/20 to-pink-500/20 text-red-400",
                      }

                      return (
                        <Card
                          key={index}
                          className="bg-slate-800/50 border-slate-600 hover:border-slate-500 transition-colors"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${colorClasses[backend.color as keyof typeof colorClasses]}`}
                                >
                                  <IconComponent className="h-6 w-6" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl text-white">{backend.name}</CardTitle>
                                  <CardDescription className="text-slate-400">
                                    {backend.language} • {backend.popularity} Popularity
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={`border-${backend.color}-500/50 text-${backend.color}-400`}
                              >
                                {backend.popularity}
                              </Badge>
                            </div>
                            <p className="text-slate-300 text-sm mt-2">{backend.description}</p>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            {/* Key Features */}
                            <div>
                              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                Key Features
                              </h4>
                              <div className="space-y-1">
                                {backend.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="w-1 h-1 bg-slate-500 rounded-full" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Best For */}
                            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="h-4 w-4 text-yellow-400" />
                                <span className="font-medium text-white text-sm">Best For</span>
                              </div>
                              <p className="text-sm text-slate-300">{backend.bestFor}</p>
                            </div>

                            {/* Databases */}
                            <div>
                              <h4 className="font-medium text-white mb-2 text-sm">Supported Databases</h4>
                              <div className="flex flex-wrap gap-1">
                                {backend.databases.map((db, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                                    {db}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Use Case Example */}
                            <div className="p-3 bg-blue-900/10 rounded-lg border border-blue-500/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Info className="h-4 w-4 text-blue-400" />
                                <span className="font-medium text-blue-400 text-sm">Use Case</span>
                              </div>
                              <p className="text-sm text-slate-300">{backend.useCase}</p>
                            </div>

                            {/* Pros and Cons */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <h4 className="font-medium text-green-400 mb-2 text-sm flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Pros
                                </h4>
                                <div className="space-y-1">
                                  {backend.pros.slice(0, 3).map((pro, idx) => (
                                    <div key={idx} className="text-xs text-slate-400 flex items-start gap-1">
                                      <div className="w-1 h-1 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                                      {pro}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-red-400 mb-2 text-sm flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Cons
                                </h4>
                                <div className="space-y-1">
                                  {backend.cons.slice(0, 3).map((con, idx) => (
                                    <div key={idx} className="text-xs text-slate-400 flex items-start gap-1">
                                      <div className="w-1 h-1 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                                      {con}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <Card className="mt-8 bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Comparison</CardTitle>
                      <CardDescription className="text-slate-400">
                        Compare backend languages for IP blocking applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-slate-600">
                              <TableHead className="text-slate-400">Language</TableHead>
                              <TableHead className="text-slate-400">Performance</TableHead>
                              <TableHead className="text-slate-400">Learning Curve</TableHead>
                              <TableHead className="text-slate-400">Ecosystem</TableHead>
                              <TableHead className="text-slate-400">Real-time</TableHead>
                              <TableHead className="text-slate-400">Enterprise</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="border-slate-600">
                              <TableCell className="font-medium text-white">Node.js</TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Good</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Easy</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Huge</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Good</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-slate-600">
                              <TableCell className="font-medium text-white">Python</TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Good</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Easy</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Large</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Good</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-slate-600">
                              <TableCell className="font-medium text-white">Go</TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Medium</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Growing</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Good</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-slate-600">
                              <TableCell className="font-medium text-white">Java</TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-red-600">Hard</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Mature</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Good</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-slate-600">
                              <TableCell className="font-medium text-white">C#/.NET</TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Medium</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Rich</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Good</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow className="border-slate-600">
                              <TableCell className="font-medium text-white">Rust</TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-red-600">Hard</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Growing</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-600">Excellent</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-yellow-600">Growing</Badge>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid gap-4 md:grid-cols-3 mt-8">
                    <Card className="bg-green-900/20 border-green-500/50">
                      <CardHeader>
                        <CardTitle className="text-green-400 text-lg flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          For Startups
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-green-300 font-medium mb-2">Recommended: Node.js</p>
                        <p className="text-slate-300 text-sm">
                          Fast development, same language as frontend, excellent for real-time IP monitoring, huge
                          ecosystem for rapid prototyping.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-900/20 border-blue-500/50">
                      <CardHeader>
                        <CardTitle className="text-blue-400 text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          For Enterprise
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-300 font-medium mb-2">Recommended: Java or C#</p>
                        <p className="text-slate-300 text-sm">
                          Mature ecosystems, excellent tooling, strong typing, great for complex IP management systems
                          with enterprise integration.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-900/20 border-purple-500/50">
                      <CardHeader>
                        <CardTitle className="text-purple-400 text-lg flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          For Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-purple-300 font-medium mb-2">Recommended: Go or Rust</p>
                        <p className="text-slate-300 text-sm">
                          Ultra-high performance, excellent concurrency, perfect for high-throughput IP filtering and
                          network security appliances.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-6">
              <Tabs defaultValue="export" className="space-y-6">
                <TabsList className="bg-slate-800 border-slate-700 text-slate-400">
                  <TabsTrigger
                    value="export"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                  >
                    Export Data
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                  >
                    Export History
                  </TabsTrigger>
                </TabsList>

                {/* Export Data Tab */}
                <TabsContent value="export" className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Export Controls */}
                    <Card className="bg-slate-900/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Download className="h-5 w-5 text-green-400" />
                          Export Data
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Download blocked IPs and security reports in CSV or JSON format
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Blocked IPs Export */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white">Blocked IPs Database</h4>
                              <p className="text-sm text-slate-400">Export all blocked IP addresses with details</p>
                            </div>
                            <Badge variant="outline" className="border-slate-600 text-slate-400">
                              {blockedIPs.length} records
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => exportBlockedIPs("csv")}
                              disabled={isExporting}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                              <TableIcon className="mr-2 h-4 w-4" />
                              {isExporting ? "Exporting..." : "Export CSV"}
                            </Button>
                            <Button
                              onClick={() => exportBlockedIPs("json")}
                              disabled={isExporting}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {isExporting ? "Exporting..." : "Export JSON"}
                            </Button>
                          </div>
                        </div>

                        <Separator className="bg-slate-700" />

                        {/* Security Report Export */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white">Security Report</h4>
                              <p className="text-sm text-slate-400">Comprehensive security analysis and statistics</p>
                            </div>
                            <Badge variant="outline" className="border-slate-600 text-slate-400">
                              {new Date().toLocaleDateString()}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => exportSecurityReport("csv")}
                              disabled={isExporting}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                            >
                              <TableIcon className="mr-2 h-4 w-4" />
                              {isExporting ? "Exporting..." : "Report CSV"}
                            </Button>
                            <Button
                              onClick={() => exportSecurityReport("json")}
                              disabled={isExporting}
                              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {isExporting ? "Exporting..." : "Report JSON"}
                            </Button>
                          </div>
                        </div>

                        <Alert className="bg-blue-900/20 border-blue-500/50">
                          <Download className="h-4 w-4 text-blue-400" />
                          <AlertDescription className="text-blue-400">
                            <strong>Export Info:</strong> Files are tracked in Export History and automatically named
                            with timestamps.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>

                    {/* Report Preview */}
                    <Card className="bg-slate-900/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Report Preview</CardTitle>
                        <CardDescription className="text-slate-400">
                          Preview of data included in security reports
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid gap-4 grid-cols-2">
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                              <div className="text-2xl font-bold text-white">{stats.totalIPs.toLocaleString()}</div>
                              <div className="text-sm text-slate-400">Total IPs Analyzed</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                              <div className="text-2xl font-bold text-white">{stats.blockedIPs}</div>
                              <div className="text-sm text-slate-400">IPs Blocked</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                              <div className="text-2xl font-bold text-white">{stats.threatsBlocked}</div>
                              <div className="text-sm text-slate-400">Threats Blocked</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                              <div className="text-2xl font-bold text-white">{stats.uptime}%</div>
                              <div className="text-sm text-slate-400">System Uptime</div>
                            </div>
                          </div>

                          <Separator className="bg-slate-700" />

                          <div className="space-y-3">
                            <h4 className="font-medium text-white">Recent Export Activity</h4>
                            <div className="space-y-2">
                              {exportHistory.slice(0, 3).map((exp) => (
                                <div
                                  key={exp.id}
                                  className="flex justify-between items-center text-sm p-2 bg-slate-800/30 rounded"
                                >
                                  <div>
                                    <span className="text-slate-300">{exp.type}</span>
                                    <span className="text-slate-500 ml-2">({exp.format})</span>
                                  </div>
                                  <span className="text-slate-400">{formatDate(exp.exportDate).split(",")[0]}</span>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-slate-600 text-slate-300 hover:text-white bg-transparent"
                              onClick={() => {
                                // Switch to history tab
                                const historyTab = document.querySelector('[value="history"]') as HTMLElement
                                historyTab?.click()
                              }}
                            >
                              View All Export History
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Export History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-white">
                            <Activity className="h-5 w-5 text-blue-400" />
                            Export History
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Track and manage all your exported files
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-slate-600 text-slate-400">
                            {exportHistory.length} exports
                          </Badge>
                          {selectedExports.length > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {selectedExports.length} selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Filters and Actions */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search exports by filename or type..."
                            value={exportFilter}
                            onChange={(e) => setExportFilter(e.target.value)}
                            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Select value={exportTypeFilter} onValueChange={setExportTypeFilter}>
                            <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
                              <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-600">
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="Blocked IPs">Blocked IPs</SelectItem>
                              <SelectItem value="Security Report">Security Report</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Bulk Actions */}
                      {exportHistory.length > 0 && (
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                          <div className="flex items-center gap-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={selectAllExports}
                              className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
                            >
                              Select All ({getFilteredExports().length})
                            </Button>
                            {selectedExports.length > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedExports([])}
                                className="border-slate-600 text-slate-300 hover:text-white"
                              >
                                Clear Selection
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedExports.length > 0 && (
                              <Button size="sm" variant="destructive" onClick={deleteSelectedExports}>
                                Delete Selected ({selectedExports.length})
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={clearAllExportHistory}
                              className="border-red-600 text-red-400 hover:text-red-300 hover:border-red-500 bg-transparent"
                            >
                              Clear All History
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Export History Table */}
                      <div className="border border-slate-600 rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-slate-600 hover:bg-slate-800/50">
                              <TableHead className="w-12 text-slate-400">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedExports.length === getFilteredExports().length &&
                                    getFilteredExports().length > 0
                                  }
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      selectAllExports()
                                    } else {
                                      setSelectedExports([])
                                    }
                                  }}
                                  className="rounded border-slate-600 bg-slate-800"
                                />
                              </TableHead>
                              <TableHead className="text-slate-400">File</TableHead>
                              <TableHead className="text-slate-400">Type</TableHead>
                              <TableHead className="text-slate-400">Format</TableHead>
                              <TableHead className="text-slate-400">Size</TableHead>
                              <TableHead className="text-slate-400">Records</TableHead>
                              <TableHead className="text-slate-400">Date</TableHead>
                              <TableHead className="text-slate-400">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getFilteredExports().length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                                  {exportHistory.length === 0 ? (
                                    <div className="space-y-2">
                                      <Download className="h-8 w-8 mx-auto text-slate-600" />
                                      <p>No exports yet</p>
                                      <p className="text-sm">Export some data to see history here</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <Search className="h-8 w-8 mx-auto text-slate-600" />
                                      <p>No exports match your filters</p>
                                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : (
                              getFilteredExports().map((exp) => (
                                <TableRow key={exp.id} className="border-slate-600 hover:bg-slate-800/30">
                                  <TableCell>
                                    <input
                                      type="checkbox"
                                      checked={selectedExports.includes(exp.id)}
                                      onChange={() => toggleExportSelection(exp.id)}
                                      className="rounded border-slate-600 bg-slate-800"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="font-mono text-sm text-white truncate max-w-48">
                                        {exp.filename}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant={exp.status === "completed" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {exp.status}
                                        </Badge>
                                        {exp.serverStored && (
                                          <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                                            Stored
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                                      {exp.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={`border-slate-600 ${
                                        exp.format === "CSV"
                                          ? "text-green-400 border-green-500/50"
                                          : "text-blue-400 border-blue-500/50"
                                      }`}
                                    >
                                      {exp.format}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-slate-300">{exp.size}</TableCell>
                                  <TableCell className="text-slate-300">{exp.records.toLocaleString()}</TableCell>
                                  <TableCell className="text-slate-400 text-sm">{formatDate(exp.exportDate)}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => downloadExportFile(exp.filename)}
                                        className="text-slate-400 hover:text-white"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteExportHistory(exp.id)}
                                        className="text-red-400 hover:text-red-300"
                                      >
                                        <AlertTriangle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Export Statistics */}
                      {exportHistory.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                            <div className="text-2xl font-bold text-white">{exportHistory.length}</div>
                            <div className="text-sm text-slate-400">Total Exports</div>
                          </div>
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                            <div className="text-2xl font-bold text-white">
                              {exportHistory.filter((exp) => exp.format === "CSV").length}
                            </div>
                            <div className="text-sm text-slate-400">CSV Files</div>
                          </div>
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                            <div className="text-2xl font-bold text-white">
                              {exportHistory.filter((exp) => exp.format === "JSON").length}
                            </div>
                            <div className="text-sm text-slate-400">JSON Files</div>
                          </div>
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                            <div className="text-2xl font-bold text-white">
                              {exportHistory.filter((exp) => exp.type === "Blocked IPs").length}
                            </div>
                            <div className="text-sm text-slate-400">IP Exports</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6">
                {/* IP Address Types */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">All Types of IP Addresses</CardTitle>
                    <CardDescription className="text-slate-400">
                      Comprehensive overview of different IP address classifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">IPv4 Addresses</h4>
                        <p className="text-sm text-slate-400">
                          32-bit address format (e.g., 192.168.1.1). Most common IP version supporting approximately 4.3
                          billion addresses. Still widely used in most networks.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">IPv6 Addresses</h4>
                        <p className="text-sm text-slate-400">
                          128-bit address format (e.g., 2001:0db8::1). Next-generation protocol supporting virtually
                          unlimited addresses. Essential for future internet growth.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Public IP Addresses</h4>
                        <p className="text-sm text-slate-400">
                          Globally unique addresses assigned by ISPs. Publicly routable on the internet. Used for
                          internet-facing services and external communication.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Private IP Addresses</h4>
                        <p className="text-sm text-slate-400">
                          Reserved ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16). Not routable on the internet.
                          Used exclusively in private networks and behind NAT.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Static IP Addresses</h4>
                        <p className="text-sm text-slate-400">
                          Permanent, manually configured IP addresses. Do not change unless manually modified. Ideal for
                          servers and devices requiring consistent addresses.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Dynamic IP Addresses</h4>
                        <p className="text-sm text-slate-400">
                          Temporary addresses assigned by DHCP servers. Change periodically or when reconnecting. Common
                          for consumer internet connections.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Network Types */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">All Types of Networks</CardTitle>
                    <CardDescription className="text-slate-400">
                      Overview of various network classifications and their characteristics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Local Area Network (LAN)</h4>
                        <p className="text-sm text-slate-400">
                          Computers connected within a limited geographic area (office, home). Typically uses private IP
                          addresses. Provides fast data transfer speeds.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Wide Area Network (WAN)</h4>
                        <p className="text-sm text-slate-400">
                          Geographically dispersed networks connected via public networks. Connects multiple LANs across
                          cities or countries. Usually slower than LANs.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Metropolitan Area Network (MAN)</h4>
                        <p className="text-sm text-slate-400">
                          Networks spanning a metropolitan area or large campus. Larger than LANs but smaller than WANs.
                          Intermediate performance characteristics.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Virtual Private Network (VPN)</h4>
                        <p className="text-sm text-slate-400">
                          Encrypted connection over public networks. Provides privacy and security. Used for secure
                          remote access and data protection.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Wireless Network (WiFi)</h4>
                        <p className="text-sm text-slate-400">
                          Networks using wireless transmission instead of cables. Provides mobility and flexibility.
                          Requires proper security measures.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Cloud Networks</h4>
                        <p className="text-sm text-slate-400">
                          Infrastructure distributed across multiple servers and data centers. Provides scalability and
                          redundancy. Often accessed via the internet.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* IP Analysis Techniques */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">IP Analysis Techniques</CardTitle>
                    <CardDescription className="text-slate-400">
                      Basic information about methods used for IP address analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Geolocation Analysis</h4>
                        <p className="text-sm text-slate-400">
                          Determines geographic location of IP addresses using databases. Identifies country, region,
                          and city information. Useful for security and compliance.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">ISP Detection</h4>
                        <p className="text-sm text-slate-400">
                          Identifies Internet Service Provider and hosting provider information. Helps identify data
                          center IPs and commercial networks. Important for security policies.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">WHOIS Lookup</h4>
                        <p className="text-sm text-slate-400">
                          Public database query containing IP registration information. Provides ownership and
                          administrative contact details. Key tool for IP investigation.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">DNS Resolution</h4>
                        <p className="text-sm text-slate-400">
                          Converts IP addresses to domain names and vice versa. Reveals associated hostnames and
                          services. Useful for identifying server infrastructure.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Reputation Scoring</h4>
                        <p className="text-sm text-slate-400">
                          Evaluates IP trustworthiness based on threat intelligence. Checks against known malicious IP
                          lists. Helps identify potentially dangerous sources.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* IP Blocking Techniques */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">IP Blocking Techniques</CardTitle>
                    <CardDescription className="text-slate-400">
                      Basic information about methods used for IP blocking and access control
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Firewall Rules</h4>
                        <p className="text-sm text-slate-400">
                          Network-level filtering using firewall configurations. Blocks traffic at the network
                          perimeter. Most common and effective blocking method.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Web Application Filtering</h4>
                        <p className="text-sm text-slate-400">
                          Application-level IP blocking implemented in web servers. Provides granular control per
                          application. Can log and alert on blocked requests.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Geographic Blocking (Geo-blocking)</h4>
                        <p className="text-sm text-slate-400">
                          Blocks IP addresses from specific geographic regions. Uses geolocation databases. Enforces
                          regional compliance and content restrictions.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Rate Limiting</h4>
                        <p className="text-sm text-slate-400">
                          Restricts requests from specific IPs to prevent abuse. Blocks IPs making excessive requests.
                          Protects against DDoS and brute-force attacks.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Blacklist/Whitelist</h4>
                        <p className="text-sm text-slate-400">
                          Maintains lists of blocked (blacklist) or allowed (whitelist) IPs. Simple and direct approach.
                          Requires regular maintenance and updates.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* IP Generation Techniques */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">IP Generation Techniques</CardTitle>
                    <CardDescription className="text-slate-400">
                      Basic information about methods used for IP address generation and assignment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">DHCP (Dynamic Host Configuration Protocol)</h4>
                        <p className="text-sm text-slate-400">
                          Automatically assigns IP addresses to devices on a network. Manages IP pools and lease times.
                          Most common method for dynamic IP assignment.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">Static Assignment</h4>
                        <p className="text-sm text-slate-400">
                          Manual configuration of IP addresses on devices. Requires administrator intervention. Ensures
                          consistent address for specific devices.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">IP Pools</h4>
                        <p className="text-sm text-slate-400">
                          Reserved ranges of addresses for automatic distribution. Prevents address conflicts and
                          exhaustion. Used by ISPs and large organizations.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">NAT (Network Address Translation)</h4>
                        <p className="text-sm text-slate-400">
                          Maps private IP addresses to public IPs for internet communication. Conserves public IP
                          resources. Enables private network access to internet.
                        </p>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <h4 className="font-semibold text-white mb-2">IPv6 Link-Local Addresses</h4>
                        <p className="text-sm text-slate-400">
                          Auto-generated addresses for local network communication. Created without manual
                          configuration. Enables plug-and-play networking capabilities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
