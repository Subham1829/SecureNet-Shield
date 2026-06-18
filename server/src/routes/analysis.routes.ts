import { Router } from "express"
import { analyzeIpAddress } from "../controllers/analysis.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/:ip", authMiddleware, analyzeIpAddress)

export { router as analysisRouter }
