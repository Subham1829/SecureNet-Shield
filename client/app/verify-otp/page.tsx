"use client"

import { useState, useEffect } from "react"
import { Shield, Key, AlertCircle, CheckCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiUrl } from "@/lib/api"

export default function VerifyOTPPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState("")
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    // Try to get email from URL or session storage
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get("email")
    const sessionEmail = sessionStorage.getItem("verifyEmail")
    
    if (emailParam) {
      setEmail(emailParam)
    } else if (sessionEmail) {
      setEmail(sessionEmail)
    } else {
      setErrors({ form: "No email address found. Please try logging in again." })
    }
  }, [])

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccess("")
    
    if (!otp) {
      setErrors({ form: "Please enter the verification code" })
      setIsLoading(false)
      return
    }
    if (!email) {
      setErrors({ form: "Email address is missing. Please log in again." })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(apiUrl("/api/auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || data.message || "Verification failed" })
      } else {
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        sessionStorage.removeItem("verifyEmail")
        setSuccess("Login verified successfully! Redirecting to dashboard...")
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1500)
      }
    } catch (err) {
      setErrors({ form: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!email) return;
    
    setIsLoading(true)
    setErrors({})
    setSuccess("")
    
    try {
      const response = await fetch(apiUrl("/api/auth/resend-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || data.message || "Failed to resend OTP" })
      } else {
        setSuccess("A new verification code has been sent to your email.")
        setCountdown(60) // Reset countdown
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
            <CardTitle className="text-3xl font-bold text-white">Verify Login</CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              {email ? `Enter the 6-digit code sent to ${email}` : "Enter your verification code"}
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

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-slate-300">Verification Code</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 text-center tracking-widest text-lg"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  disabled={!email || isLoading}
                />
              </div>
              {countdown > 0 && (
                <p className="text-xs text-slate-400 text-right mt-1">
                  Code expires in {countdown}s
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify & Log In"
              )}
            </Button>

            <div className="text-center mt-4 text-sm text-slate-400">
              Didn't receive the code?{" "}
              <button 
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading || countdown > 0 || !email}
                className="text-blue-400 hover:text-blue-300 hover:underline disabled:opacity-50"
              >
                {countdown > 0 ? `Resend available in ${countdown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
