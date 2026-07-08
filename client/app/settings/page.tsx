"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, User, Lock, CheckCircle, AlertTriangle } from "lucide-react"

import { AppSidebar } from "@/components/AppSidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiUrl } from "@/lib/api"

export default function SettingsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" })

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
      fetchProfile(token)
    }
  }, [router])

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(apiUrl("/api/user/me"), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setFullName(data.fullName || "")
        setEmail(data.email || "")
      }
    } catch (error) {
      console.error("Failed to fetch profile", error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMessage({ type: "", text: "" })
    setProfileLoading(true)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(apiUrl("/api/user/profile"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fullName })
      })
      const data = await res.json()

      if (res.ok) {
        setProfileMessage({ type: "success", text: "Profile updated successfully" })
      } else {
        setProfileMessage({ type: "error", text: data.error || "Failed to update profile" })
      }
    } catch (error) {
      setProfileMessage({ type: "error", text: "An error occurred" })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage({ type: "", text: "" })

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters" })
      return
    }

    setPasswordLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(apiUrl("/api/user/password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await res.json()

      if (res.ok) {
        setPasswordMessage({ type: "success", text: "Password updated successfully" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setPasswordMessage({ type: "error", text: data.error || "Failed to update password" })
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "An error occurred" })
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!isAuthenticated) return null

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
      <div className="flex-1 overflow-auto">
        <header className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-50">
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
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl p-6 relative z-10 pt-8">
          <Tabs defaultValue="profile" className="w-full space-y-6">
            <TabsList className="bg-card border border-border h-12 w-full justify-start rounded-lg overflow-x-auto overflow-y-hidden custom-scrollbar px-1 py-1">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-9">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary h-9">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-card border-border shadow-md">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account's profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {profileMessage.text && (
                      <Alert variant={profileMessage.type === "error" ? "destructive" : "default"} className={profileMessage.type === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                        {profileMessage.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                        <AlertDescription>{profileMessage.text}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-muted text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-background"
                      />
                    </div>

                    <Button type="submit" disabled={profileLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-card border-border shadow-md">
                <CardHeader>
                  <CardTitle>Update Password</CardTitle>
                  <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    {passwordMessage.text && (
                      <Alert variant={passwordMessage.type === "error" ? "destructive" : "default"} className={passwordMessage.type === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                        {passwordMessage.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                        <AlertDescription>{passwordMessage.text}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <Button type="submit" disabled={passwordLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                      {passwordLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
