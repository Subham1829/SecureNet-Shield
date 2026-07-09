import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { getMe, updateProfile, updatePassword } from "../controllers/user.controller.js"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { updateProfileSchema, updatePasswordSchema } from "../validations/user.validation.js"

const router = Router()

// All user routes require authentication
router.use(authMiddleware)

// Get current user profile
router.get("/me", getMe)

// Update user profile
router.put("/profile", validateRequest(updateProfileSchema), updateProfile)

// Update user password
router.put("/password", validateRequest(updatePasswordSchema), updatePassword)

export { router as userRoutes }
