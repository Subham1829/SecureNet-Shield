import { Request, Response, NextFunction } from "express"

export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const isProduction = process.env.NODE_ENV === "production"

  // Log the error in production for internal tracking, but not to the client
  if (!isProduction) {
    console.error("Global Error Handler:", err)
  } else {
    // In production, we might want to log to a file or external service
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`)
  }

  // Prevent leaking stack traces in production
  res.status(500).json({
    status: "error",
    message: isProduction ? "Internal Server Error" : err.message,
    stack: isProduction ? undefined : err.stack,
  })
}
