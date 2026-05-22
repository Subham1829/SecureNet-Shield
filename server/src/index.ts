import cors from "cors"
import express from "express"
import exportsRouter from "./routes/exports.js"

const app = express()
const PORT = Number(process.env.PORT) || 4000
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3001"],
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.use("/api/exports", exportsRouter)

const server = app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
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
