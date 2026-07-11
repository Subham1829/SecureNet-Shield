import { Request, Response } from "express"
import { User } from "../models/User.js"
import bcrypt from "bcryptjs"
import { catchAsync } from "../utils/catchAsync.js"

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).select("-password -otp -otpExpiresAt")
  
  if (!user) {
    return res.status(404).json({ error: "User not found" })
  }
  
  return res.json(user)
})

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
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
})

export const updatePassword = catchAsync(async (req: Request, res: Response) => {
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
})
