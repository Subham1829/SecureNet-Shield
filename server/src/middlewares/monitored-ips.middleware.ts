import { Request, Response, NextFunction } from "express"
import { MonitoredIP } from "../models/MonitoredIP.js"

export const monitorIPMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress
  if (!ip) return next()

  try {
    await MonitoredIP.findOneAndUpdate(
      { ip },
      { 
        $set: { lastSeen: new Date() },
        $inc: { requestCount: 1 }
      },
      { upsert: true, returnDocument: 'after' }
    )
  } catch (error) {
    console.error("Failed to monitor IP:", error)
  }

  next()
}
