import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { BlacklistedToken } from "../models/BlacklistedToken.js";
import { sendPasswordResetEmail } from "../lib/email.js";
import { logAction } from "../lib/logger.js";
import crypto from "crypto";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is strictly required in production.");
}

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email.toLowerCase();
  const { fullName, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ error: "User with this email already exists." });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    },
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    await logAction(
      "FAILED_LOGIN",
      `Failed login attempt for email: ${email}`,
      email,
    );
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await logAction(
      "FAILED_LOGIN",
      `Failed login attempt for email: ${email}`,
      email,
    );
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    success: true,
    message: "Login verified successfully.",
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email },
  });
});



export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];

  let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
  const decoded = jwt.decode(token) as { exp?: number };
  if (decoded && decoded.exp) {
    expiresAt = new Date(decoded.exp * 1000);
  }
  await BlacklistedToken.findOneAndUpdate(
    { token },
    { token, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return the same message to prevent email enumeration
    const successMessage =
      "If an account exists, a password reset link has been sent.";

    if (!user) {
      return res.status(200).json({ message: successMessage });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving (so if DB is compromised, tokens are safe)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save to user with 1 hour expiration
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // Send email with the unhashed token
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user, resetLink);

    return res.status(200).json({ message: successMessage });
  },
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token and new password are required." });
  }

  // Hash the incoming token to compare with DB
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiresAt: { $gt: new Date() }, // Must not be expired
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired reset token." });
  }

  // Hash the new password
  const saltRounds = 10;
  user.password = await bcrypt.hash(newPassword, saltRounds);

  // Invalidate the reset token
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;

  await user.save();

  return res
    .status(200)
    .json({ message: "Password has been successfully reset." });
});
