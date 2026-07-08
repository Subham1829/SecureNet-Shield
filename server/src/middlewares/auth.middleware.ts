import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { BlacklistedToken } from "../models/BlacklistedToken.js"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod"
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is strictly required in production.")
}

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required. Missing or invalid token format." })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Authentication required. Token is missing." })
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistedToken.exists({ token })
    if (isBlacklisted) {
      return res.status(401).json({ error: "Authentication required. Token has been revoked. Please log in again." })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    
    // Attach user ID to the request object for subsequent middleware/controllers
    req.userId = decoded.id
    
    return next()
  } catch (error) {
    console.error("Auth Middleware Error:", error)
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token has expired. Please log in again." })
    }
    return res.status(401).json({ error: "Invalid token. Authentication failed." })
  }
}
