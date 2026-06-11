import { Request, Response } from "express"
import { BlockedIP } from "../models/BlockedIP.js"

export const listBlockedIPs = async (req: Request, res: Response) => {
  try {
    const ips = await BlockedIP.find().sort({ createdAt: -1 })
    return res.json(ips)
  } catch (error) {
    console.error("Error listing blocked IPs:", error)
    return res.status(500).json({ error: "Failed to list blocked IPs" })
  }
}

export const addBlockedIP = async (req: Request, res: Response) => {
  try {
    const { ip, reason } = req.body

    const existing = await BlockedIP.findOne({ ip })
    if (existing) {
      return res.status(409).json({ error: "IP is already blocked" })
    }

    const newBlockedIP = new BlockedIP({ ip, reason })
    await newBlockedIP.save()

    return res.status(201).json(newBlockedIP)
  } catch (error) {
    console.error("Error adding blocked IP:", error)
    return res.status(500).json({ error: "Failed to block IP" })
  }
}

export const removeBlockedIP = async (req: Request, res: Response) => {
  try {
    const { ip } = req.params

    const deleted = await BlockedIP.findOneAndDelete({ ip })
    if (!deleted) {
      return res.status(404).json({ error: "Blocked IP not found" })
    }

    return res.json({ success: true, message: "IP unblocked successfully" })
  } catch (error) {
    console.error("Error removing blocked IP:", error)
    return res.status(500).json({ error: "Failed to unblock IP" })
  }
}
