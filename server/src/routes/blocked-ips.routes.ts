import { Router } from "express"
import { z } from "zod"
import { addBlockedIP, listBlockedIPs, removeBlockedIP } from "../controllers/blocked-ips.controller.js"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// Regex for IPv4 and IPv6
const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

const addBlockedIPSchema = z.object({
  body: z.object({
    ip: z.string().regex(ipRegex, "Invalid IP address format"),
    reason: z.string().min(1, "Reason is required"),
  }),
})

const removeBlockedIPSchema = z.object({
  params: z.object({
    ip: z.string().regex(ipRegex, "Invalid IP address format"),
  }),
})

router.use(authMiddleware)

router.get("/", listBlockedIPs)

router.post("/", validateRequest(addBlockedIPSchema), addBlockedIP)

router.delete("/:ip", validateRequest(removeBlockedIPSchema), removeBlockedIP)

export default router
