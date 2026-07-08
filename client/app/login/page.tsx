"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiUrl } from "@/lib/api"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccess("")

    const newErrors: Record<string, string> = {}
    
    if (!loginData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!loginData.password) {
      newErrors.password = "Password is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || data.message || "Login failed" })
      } else {
        if (data.requiresOTP) {
          setSuccess("Credentials verified. Redirecting to OTP verification...")
          sessionStorage.setItem("verifyEmail", loginData.email)
          setTimeout(() => {
            window.location.href = `/verify-otp?email=${encodeURIComponent(loginData.email)}`
          }, 1000)
        } else if (data.token) {
          localStorage.setItem("token", data.token)
          setSuccess("Authentication successful! Redirecting to dashboard...")
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1500)
        }
      }
    } catch (err) {
      setErrors({ form: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      
      <Card className="w-full max-w-md bg-slate-900/90 border-slate-700 shadow-2xl backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white">Log In</CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Welcome back to IP Guardian
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {success && (
            <Alert className="bg-green-900/20 border-green-500/50">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {errors.form && (
            <Alert className="bg-red-900/20 border-red-500/50 mb-4">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{errors.form}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={loginData.rememberMe}
                  onCheckedChange={(checked) => setLoginData({...loginData, rememberMe: checked as boolean})}
                  className="border-slate-600 data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="remember" className="text-sm text-slate-300">Remember me</Label>
              </div>
              <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "Log In"
              )}
            </Button>

            <div className="text-center mt-4 text-sm text-slate-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
