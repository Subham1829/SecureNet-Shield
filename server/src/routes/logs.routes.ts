import { Router, Request, Response } from "express"
import { AuditLog } from "../models/AuditLog.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { catchAsync } from "../utils/catchAsync.js"

export const logsRouter = Router()

// Apply auth middleware
logsRouter.use(authMiddleware)

// GET /api/logs
logsRouter.get("/", catchAsync(async (req: Request, res: Response) => {
  const { actionType, username, startDate, endDate } = req.query

  const query: any = {}

  if (actionType) {
    query.actionType = actionType
  }

  if (username) {
    query.username = { $regex: new RegExp(username as string, "i") } // Case-insensitive search
  }

  if (startDate || endDate) {
    query.createdAt = {}
    if (startDate) {
      query.createdAt.$gte = new Date(startDate as string)
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate as string)
    }
  }

  const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(200)
  res.status(200).json(logs)
}))
