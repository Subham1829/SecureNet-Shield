import { z } from "zod"

export const analyzeSchema = z.object({
  params: z.object({
    ip: z.string().min(1, "IP address is required"),
  })
})
