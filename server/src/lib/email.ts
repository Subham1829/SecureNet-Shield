import nodemailer from "nodemailer";
import { User } from "../models/User";

// Configure Nodemailer to use Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});



export interface EmailUser {
  email: string;
}

export const sendPasswordResetEmail = async (user: EmailUser, resetLink: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request - IP Guardian",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Password</title>
        </head>
        <body style="background-color: #0f172a; margin: 0; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">IP Guardian</h1>
                      <p style="margin: 10px 0 0; font-size: 16px; color: #94a3b8;">Password Reset</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; text-align: center;">
                      <p style="font-size: 16px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                        We received a request to reset your password. Click the button below to choose a new one:
                      </p>
                      <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                        Reset Password
                      </a>
                      <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">
                        If you didn't request a password reset, you can safely ignore this email. This link will expire in 1 hour.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password Reset Email sent successfully: %s", info.messageId);
  } catch (error) {
    console.error("Error sending Password Reset email:", error);
    throw new Error("Failed to send reset email.");
  }
};
