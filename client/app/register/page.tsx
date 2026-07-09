"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Shield, AlertCircle, CheckCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiUrl } from "@/lib/api"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState("")

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    
    return {
      minLength,
      hasSpecialChar,
      hasNumber,
      hasUpperCase,
      isValid: minLength && hasSpecialChar && hasNumber && hasUpperCase
    }
  }

  const getPasswordStrength = (password: string) => {
    const validation = validatePassword(password)
    let strength = 0
    if (validation.minLength) strength += 25
    if (validation.hasUpperCase) strength += 25
    if (validation.hasNumber) strength += 25
    if (validation.hasSpecialChar) strength += 25
    return strength
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccess("")

    const newErrors: Record<string, string> = {}
    
    if (!signupData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    
    if (!signupData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(signupData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    const passwordValidation = validatePassword(signupData.password)
    if (!signupData.password) {
      newErrors.password = "Password is required"
    } else if (!passwordValidation.isValid) {
      newErrors.password = "Password must meet all requirements"
    }
    
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName: signupData.fullName, 
          email: signupData.email, 
          password: signupData.password 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || data.message || "Registration failed" })
      } else {
        if (data.requiresOTP) {
          setSuccess("Account created successfully! Redirecting to OTP verification...")
          sessionStorage.setItem("verifyEmail", signupData.email)
          setTimeout(() => {
            window.location.href = `/verify-otp?email=${encodeURIComponent(signupData.email)}`
          }, 1500)
        } else if (data.token) {
          localStorage.setItem("token", data.token)
          setSuccess("Account created successfully! Redirecting to dashboard...")
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

  const passwordStrength = getPasswordStrength(signupData.password)
  const passwordValidation = validatePassword(signupData.password)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-primary/5" />
      
      <Card className="w-full max-w-md bg-background/90 border-border shadow-2xl backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg">
            <Shield className="h-8 w-8 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Join IP Guardian to secure your network
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

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-muted-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name"
                  className={`pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary ${errors.fullName ? 'border-red-500' : ''}`}
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.fullName}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary ${errors.email ? 'border-red-500' : ''}`}
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
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
              <Label htmlFor="signup-password" className="text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`pl-10 pr-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary ${errors.password ? 'border-red-500' : ''}`}
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {signupData.password && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Password strength</span>
                    <span className={
                      passwordStrength < 50 ? "text-red-400" :
                      passwordStrength < 75 ? "text-yellow-400" :
                      "text-green-400"
                    }>
                      {passwordStrength < 50 ? "Weak" :
                       passwordStrength < 75 ? "Medium" :
                       "Strong"}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength} 
                    className="h-2 bg-slate-700"
                  />
                  
                  <div className="text-xs space-y-1">
                    <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-1 h-1 rounded-full ${passwordValidation.minLength ? 'bg-green-400' : 'bg-red-400'}`} />
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-1 h-1 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-400' : 'bg-red-400'}`} />
                      Uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-1 h-1 rounded-full ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-red-400'}`} />
                      Number
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-400' : 'text-red-400'}`}>
                      <div className={`w-1 h-1 rounded-full ${passwordValidation.hasSpecialChar ? 'bg-green-400' : 'bg-red-400'}`} />
                      Special character
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-muted-foreground">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`pl-10 pr-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-foreground font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
