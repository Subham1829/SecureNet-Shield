import mongoose, { Schema, Document } from "mongoose"

export interface IAuditLog extends Document {
  actionType: string
  details: string
  username?: string
  userId?: string
  ip?: string
  createdAt: Date
}

const AuditLogSchema: Schema = new Schema({
  actionType: { type: String, required: true },
  details: { type: String, required: true },
  username: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema)
