import { Router } from "express"
import { loginRateLimiter } from "../middlewares/rate-limiters.middleware.js"
import { registerUser, loginUser, logoutUser, verifyOTP, resendOTP } from "../controllers/auth.controller.js"

const router = Router()

// Register new user (not rate limited to the same extreme as login)
router.post("/register", registerUser)

// Login endpoint wrapped with loginRateLimiter
router.post("/login", loginRateLimiter, loginUser)

// Logout endpoint
router.post("/logout", logoutUser)

// OTP endpoints
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)

export { router as authRoutes }
