import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const isProduction = process.env.NODE_ENV === "production"
  let statusCode = err.statusCode || 500
  let message = err.message || "Internal Server Error"

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400
    message = "Duplicate field value entered"
  }

  // Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
  }

  // Mongoose Cast Error (Invalid ID)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // Log the error
  if (!isProduction) {
    console.error("Global Error Handler:", err)
  } else if (statusCode === 500) {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`)
  }

  return res.status(statusCode).json({
    status: statusCode < 500 ? "fail" : "error",
    error: isProduction && statusCode === 500 ? "Internal Server Error" : message,
    stack: isProduction ? undefined : err.stack,
  })
}
