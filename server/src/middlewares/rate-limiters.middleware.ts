import rateLimit from "express-rate-limit"
import { BlockedIP } from "../models/BlockedIP.js"

// Helper function to auto-block IPs
const autoBlockIP = async (ip: string, reason: string) => {
  try {
    const existing = await BlockedIP.findOne({ ip })
    if (!existing) {
      await BlockedIP.create({ ip, reason })
      console.log(`[Auto-Block] Banned IP ${ip} for: ${reason}`)
    }
  } catch (error) {
    console.error(`Failed to auto-block IP ${ip}:`, error)
  }
}

// 1. Global Rate Limiter: Max 20 requests per 1 second
export const globalRateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 20, // Limit each IP to 20 requests per `window`
  handler: async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "0.0.0.0"
    await autoBlockIP(ip, "Excessive requests (>20/sec)")
    res.status(429).json({
      error: "Too Many Requests",
      message: "You have been blocked due to excessive requests.",
    })
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// 2. Login Rate Limiter: Max 20 failed requests per 5 minutes
export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 requests per `window`
  skipSuccessfulRequests: true, // Only count failed logins (status >= 400)
  handler: async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "0.0.0.0"
    await autoBlockIP(ip, "Excessive failed logins (>20/5min)")
    res.status(429).json({
      error: "Too Many Requests",
      message: "You have been blocked due to excessive failed login attempts.",
    })
  },
  standardHeaders: true,
  legacyHeaders: false,
})
