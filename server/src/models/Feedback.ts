import mongoose, { Schema, Document } from "mongoose"

export interface IFeedback extends Document {
  rating: number
  comment: string
  category: string
  anonymous: boolean
  username: string
  createdAt: Date
}

const FeedbackSchema: Schema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  category: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  username: { type: String, default: "Anonymous" },
  createdAt: { type: Date, default: Date.now },
})

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema)
