import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getMe, updateProfile, updatePassword } from "../controllers/user.controller.js"

const router = Router()

// All user routes require authentication
router.use(authMiddleware)

// Get current user profile
router.get("/me", getMe)

// Update user profile (name)
router.put("/profile", updateProfile)

// Update user password
router.put("/password", updatePassword)

export { router as userRoutes }
