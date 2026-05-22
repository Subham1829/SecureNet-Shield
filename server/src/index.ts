import cors from "cors"
import express from "express"
import { getAllowedOrigins } from "./lib/cors.js"
import exportsRouter from "./routes/exports.js"

const app = express()
const PORT = Number(process.env.PORT) || 4000
const HOST = process.env.HOST || "0.0.0.0"
const isProduction = process.env.NODE_ENV === "production"

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: isProduction ? "production" : "development" })
})

app.use("/api/exports", exportsRouter)

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
