import "dotenv/config"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import compression from "compression"
import morgan from "morgan"
import { getAllowedOrigins } from "./lib/cors.js"
import exportsRouter from "./routes/exports.js"
import blockedIpsRouter from "./routes/blocked-ips.routes.js"
import { statsRouter } from "./routes/stats.routes.js"
import { logsRouter } from "./routes/logs.routes.js"
import { blockedCheckMiddleware } from "./middlewares/blocked-check.middleware.js"
import { globalRateLimiter } from "./middlewares/rate-limiters.middleware.js"
import { globalErrorHandler } from "./middlewares/error.middleware.js"
import { authRoutes } from "./routes/auth.routes.js"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

import { monitorIPMiddleware } from "./middlewares/monitored-ips.middleware.js"

const app = express()
const PORT = Number(process.env.PORT) || 4000
const HOST = process.env.HOST || "localhost"
const isProduction = process.env.NODE_ENV === "production"

// Production Middlewares
app.use(helmet())
app.use(compression())
app.use(morgan(isProduction ? "combined" : "dev"))

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())

// Monitor all incoming IPs
app.use(monitorIPMiddleware)

// Apply blocked IP check globally BEFORE rate limits
app.use(blockedCheckMiddleware)

// Apply global rate limiter
app.use(globalRateLimiter)

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: isProduction ? "production" : "development" })
})

import { analysisRouter } from "./routes/analysis.routes.js"
import { feedbackRouter } from "./routes/feedback.routes.js"
import { userRoutes } from "./routes/user.routes.js"

app.use("/api/exports", exportsRouter)
app.use("/api/blocked-ips", blockedIpsRouter)
app.use("/api/stats", statsRouter)
app.use("/api/logs", logsRouter)
app.use("/api/auth", authRoutes)
app.use("/api/analyze", analysisRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/user", userRoutes)

// Global Error Handler must be the last middleware
app.use(globalErrorHandler)

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/securenet"
if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is strictly required in production.")
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    
    // Only listen if not running in a serverless environment like Vercel
    if (!process.env.VERCEL) {
      const server = app.listen(PORT, HOST, () => {
        console.log(`API server running at http://${HOST}:${PORT}`)
      })

      server.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          console.error(
            `Port ${PORT} is already in use. Stop the other process or set PORT in server/.env (e.g. PORT=4001).`,
          )
          console.error(`Windows: netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F`)
        } else {
          console.error(err)
        }
        process.exit(1)
      })
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    if (!process.env.VERCEL) {
      process.exit(1)
    }
  })

export default app


