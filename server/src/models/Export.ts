import mongoose, { Document, Schema } from "mongoose"

export interface IExport extends Document {
  filename: string
  type: string
  format: string
  size: string
  records: number
  status: string
  serverStored: boolean
  userId: mongoose.Types.ObjectId
  createdAt: Date
}

const exportSchema = new Schema<IExport>({
  filename: { type: String, required: true },
  type: { type: String, required: true },
  format: { type: String, required: true },
  size: { type: String, required: true },
  records: { type: Number, required: true },
  status: { type: String, default: "completed" },
  serverStored: { type: Boolean, default: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Export = mongoose.model<IExport>("Export", exportSchema)
