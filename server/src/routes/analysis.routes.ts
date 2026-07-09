import { Router } from "express"
import { analyzeIpAddress } from "../controllers/analysis.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { analyzeSchema } from "../validations/analysis.validation.js"

const router = Router()

router.get("/:ip", authMiddleware, validateRequest(analyzeSchema), analyzeIpAddress)

export { router as analysisRouter }
