import { Router } from "express"
import { getDashboardStats, getMonitoredIPs } from "../controllers/stats.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", authMiddleware, getDashboardStats)
router.get("/monitored-ips", authMiddleware, getMonitoredIPs)

export { router as statsRouter }
