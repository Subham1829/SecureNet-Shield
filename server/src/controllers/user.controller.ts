import { Request, Response } from "express"
import { User } from "../models/User.js"
import bcrypt from "bcrypt"

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password -otp -otpExpiresAt")
    
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    
    return res.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return res.status(500).json({ error: "Failed to fetch user profile" })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { fullName } = req.body
    
    if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
      return res.status(400).json({ error: "Full name is required" })
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName: fullName.trim() },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpiresAt")
    
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    
    return res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    console.error("Error updating profile:", error)
    return res.status(500).json({ error: "Failed to update profile" })
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" })
    }
    
    const user = await User.findById(req.userId)
    
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" })
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()
    
    return res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error updating password:", error)
    return res.status(500).json({ error: "Failed to update password" })
  }
}
