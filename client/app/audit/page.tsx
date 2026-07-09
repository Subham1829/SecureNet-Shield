"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/AppSidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, FileText, Search, User } from 'lucide-react'
import { apiUrl } from "@/lib/api"
import { format } from "date-fns"

interface AuditLog {
  _id: string;
  actionType: string;
  details: string;
  username?: string;
  ip?: string;
  createdAt: string;
}

export default function LogsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [actionType, setActionType] = useState<string>("all");
  const [username, setUsername] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchLogs(token);
    }
  }, [router]);

  const fetchLogs = async (token: string, filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (actionType && actionType !== "all") queryParams.append("actionType", actionType);
      if (username) queryParams.append("username", username);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const res = await fetch(apiUrl(`/api/logs?${queryParams.toString()}`), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchLogs(token, { actionType, username, startDate, endDate });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden w-64 lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-background">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-50 shrink-0">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-background">
                <AppSidebar />
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Audit Logs
              </h1>
              <p className="text-muted-foreground text-sm">Detailed history of all security events</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Filters Section */}
            <div className="p-4 rounded-xl border border-border bg-card shadow-md flex flex-wrap gap-4 items-end">
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action Type</label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger className="w-full bg-accent border-white/10 rounded-lg text-sm">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="IP_BLOCKED">IP Blocked</SelectItem>
                    <SelectItem value="IP_UNBLOCKED">IP Unblocked</SelectItem>
                    <SelectItem value="REPORT_EXPORTED">Report Exported</SelectItem>
                    <SelectItem value="FAILED_LOGIN">Failed Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by username..." 
                    className="pl-9 bg-accent border-white/10 rounded-lg text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-[150px]">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
                <Input 
                  type="date"
                  className="bg-accent border-white/10 rounded-lg text-sm custom-calendar-icon"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <div className="space-y-1.5 flex-1 min-w-[150px]">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">End Date</label>
                <Input 
                  type="date"
                  className="bg-accent border-white/10 rounded-lg text-sm custom-calendar-icon"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <Button onClick={applyFilters} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg px-6 h-10 shadow-lg shadow-primary/20">
                Filter
              </Button>
            </div>

            {/* Logs Timeline / Table */}
            <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-accent/50 text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Timestamp</th>
                      <th className="px-6 py-4 font-semibold">Action</th>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            Loading logs...
                          </div>
                        </td>
                      </tr>
                    ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                          No audit logs found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log._id} className="border-b border-border hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                            {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                              {log.actionType}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-foreground">{log.username || "System/Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {log.details}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
