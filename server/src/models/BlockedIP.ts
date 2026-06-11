import mongoose, { Document, Schema } from "mongoose"

export interface IBlockedIP extends Document {
  ip: string
  reason: string
  date: Date
  status: string
  location: string
  threat: string
}

const BlockedIPSchema = new Schema<IBlockedIP>(
  {
    ip: { type: String, required: true, unique: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: "Blocked" },
    location: { type: String, default: "Unknown" },
    threat: { type: String, default: "High" },
  },
  {
    timestamps: true,
  },
)

export const BlockedIP = mongoose.model<IBlockedIP>("BlockedIP", BlockedIPSchema)
