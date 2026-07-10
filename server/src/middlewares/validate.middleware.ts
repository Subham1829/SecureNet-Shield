import { Request, Response, NextFunction } from "express"
import { z, ZodError } from "zod"

export const validateRequest =
  (schema: z.ZodSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || []
        return res.status(400).json({
          error: "Validation failed",
          details: issues.map((e: any) => ({
            path: e.path ? e.path.join(".") : "unknown",
            message: e.message,
          })),
        })
      }
      return res.status(500).json({ error: "Internal server error during validation" })
    }
  }
