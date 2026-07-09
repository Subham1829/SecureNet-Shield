import { Router } from "express"
import { loginRateLimiter } from "../middlewares/rate-limiters.middleware.js"
import { registerUser, loginUser, logoutUser, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { registerSchema, loginSchema, otpSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/auth.validation.js"

const router = Router()

// Register new user (not rate limited to the same extreme as login)
router.post("/register", validateRequest(registerSchema), registerUser)

// Login endpoint wrapped with loginRateLimiter
router.post("/login", loginRateLimiter, validateRequest(loginSchema), loginUser)

// Logout endpoint
router.post("/logout", logoutUser)

// OTP endpoints
router.post("/verify-otp", validateRequest(otpSchema), verifyOTP)
router.post("/resend-otp", validateRequest(forgotPasswordSchema), resendOTP) // Reuses forgot password schema because it's just email

// Password reset endpoints
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword)
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword)

export { router as authRoutes }
