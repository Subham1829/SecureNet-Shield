import { z } from "zod"

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  })
})

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  })
})
