import { z } from "zod"

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
})

export const otpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
  })
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  })
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  })
})
