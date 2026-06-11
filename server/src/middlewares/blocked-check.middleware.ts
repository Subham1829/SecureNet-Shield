import { Request, Response, NextFunction } from "express"
import { BlockedIP } from "../models/BlockedIP.js"

// Simple in-memory cache to reduce DB hits for every single request
const blockedCache = new Set<string>()
let lastCacheUpdate = 0
const CACHE_TTL = 10000 // 10 seconds

export const blockedCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "0.0.0.0"

    // 1. Fast check in memory cache
    if (blockedCache.has(ip)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Your IP address is blocked.",
      })
    }

    // 2. Periodically check DB to keep cache fresh (every 10 seconds)
    const now = Date.now()
    if (now - lastCacheUpdate > CACHE_TTL) {
      const blockedIps = await BlockedIP.find({}, { ip: 1 }).lean()
      blockedCache.clear()
      blockedIps.forEach((doc) => blockedCache.add(doc.ip))
      lastCacheUpdate = now

      // Check again after cache update
      if (blockedCache.has(ip)) {
        return res.status(403).json({
          error: "Forbidden",
          message: "Your IP address is blocked.",
        })
      }
    }

    next()
  } catch (error) {
    console.error("Error in blocked-check middleware:", error)
    next()
  }
}
