import { z } from "zod"

export const createFeedbackSchema = z.object({
  body: z.object({
    feedback: z.string().min(1, "Feedback cannot be empty").max(1000, "Feedback is too long"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5").optional(),
  })
})
