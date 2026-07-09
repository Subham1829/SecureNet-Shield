import { Router, Request, Response } from "express"
import { Feedback } from "../models/Feedback.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { validateRequest } from "../middlewares/validate.middleware.js"
import { createFeedbackSchema } from "../validations/feedback.validation.js"

export const feedbackRouter = Router()

// GET /api/feedback
feedbackRouter.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(50)
    res.status(200).json(feedbacks)
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    res.status(500).json({ error: "Failed to fetch feedbacks" })
  }
})

// POST /api/feedback
feedbackRouter.post("/", authMiddleware, validateRequest(createFeedbackSchema), async (req: Request, res: Response) => {
  try {
    const { rating, comment, category, anonymous, username } = req.body

    const newFeedback = await Feedback.create({
      rating,
      comment,
      category,
      anonymous,
      username: anonymous ? "Anonymous" : (username || "Anonymous"),
    })

    res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback })
  } catch (error) {
    console.error("Error creating feedback:", error)
    res.status(500).json({ error: "Failed to submit feedback" })
  }
})
