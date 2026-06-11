import { Router } from "express"
import { getDashboardStats } from "../controllers/stats.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", authMiddleware, getDashboardStats)

export { router as statsRouter }
