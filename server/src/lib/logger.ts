import { AuditLog } from "../models/AuditLog.js"

export const logAction = async (
  actionType: string,
  details: string,
  username?: string,
  userId?: string,
  ip?: string
) => {
  try {
    await AuditLog.create({
      actionType,
      details,
      username,
      userId,
      ip
    })
  } catch (error) {
    console.error("Failed to write audit log:", error)
  }
}
