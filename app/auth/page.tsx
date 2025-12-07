"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Shield, AlertCircle, CheckCircle, Zap } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  // Sign up form state
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
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

    // Simulate API call with bcrypt hashing
    setTimeout(() => {
      setIsLoading(false)
      setSuccess("Authentication successful! Redirecting to dashboard...")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    }, 2000)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation
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

    // Simulate API call with bcrypt hashing
    setTimeout(() => {
      setIsLoading(false)
      setSuccess("Account created successfully! Redirecting to dashboard...")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    }, 2000)
  }

  const passwordStrength = getPasswordStrength(signupData.password)
  const passwordValidation = validatePassword(signupData.password)

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
            <CardTitle className="text-3xl font-bold text-white">IP Guardian</CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Advanced IP blocking and network security platform
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

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
              <TabsTrigger value="login" className="data-[state=active]:bg-slate-700 text-slate-300">
                Log In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-slate-700 text-slate-300">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
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
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-slate-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="Enter your full name"
                      className={`pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 ${errors.fullName ? 'border-red-500' : ''}`}
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
                  <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
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
                  <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={`pl-10 pr-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
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
                  
                  {signupData.password && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Password strength</span>
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
                  <Label htmlFor="confirm-password" className="text-slate-300">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-500 hover:text-slate-300"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium" 
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
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
