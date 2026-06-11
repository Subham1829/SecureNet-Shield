import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod"

// Helper function to set JWT cookie
const setTokenCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true, // Prevents JS access to the cookie (XSS protection)
    secure: process.env.NODE_ENV === "production", // Requires HTTPS in prod
    sameSite: "lax", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists." })
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })
    await newUser.save()

    // Generate token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" })

    // Set cookie
    setTokenCookie(res, token)

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return res.status(500).json({ error: "Failed to register user." })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." })
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." })
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" })

    // Set cookie
    setTokenCookie(res, token)

    return res.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, fullName: user.fullName, email: user.email },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ error: "Failed to log in." })
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token")
  return res.json({ success: true, message: "Logged out successfully" })
}
