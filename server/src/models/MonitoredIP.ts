import mongoose from "mongoose"

const monitoredIPSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, unique: true },
    lastSeen: { type: Date, default: Date.now },
    requestCount: { type: Number, default: 1 },
  },
  { timestamps: true }
)

export const MonitoredIP = mongoose.model("MonitoredIP", monitoredIPSchema)
