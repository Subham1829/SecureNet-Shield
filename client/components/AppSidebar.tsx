"use client"

import Link from "next/link"
import { Shield, Activity, MessageSquare, LogOut, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiUrl } from "@/lib/api"

export function AppSidebar() {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetch(apiUrl("/api/auth/logout"), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      }
    } catch (e) {
      console.error("Logout error", e)
    } finally {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
  }

  return (
    <div className="flex h-full flex-col bg-background border-r border-border">
      <div className="flex h-16 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-[0_0_20px_rgba(201,138,62,0.4)]">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">IP Guardian</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-3">
          <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground hover:bg-card" asChild>
            <Link href="/dashboard">
              <Activity className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground hover:bg-card" asChild>
            <Link href="/feedback">
              <MessageSquare className="mr-3 h-4 w-4" />
              Feedback
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start text-muted-foreground hover:text-foreground hover:bg-card" asChild>
            <Link href="/audit">
              <FileText className="mr-3 h-4 w-4" />
              Audit Logs
            </Link>
          </Button>
        </nav>
      </div>
      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-card"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
