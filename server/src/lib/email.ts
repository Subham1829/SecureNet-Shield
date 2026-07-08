import nodemailer from "nodemailer"

// Configure Nodemailer to use Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export const sendOTPEmail = async (to: string, otp: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Email Verification OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>IP Guardian Verification</title>
        </head>
        <body style="background-color: #0f172a; margin: 0; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
                      <div style="display: inline-block; padding: 12px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 50%; margin-bottom: 20px;">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">IP Guardian</h1>
                      <p style="margin: 10px 0 0; font-size: 16px; color: #94a3b8;">Secure Identity Verification</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding: 30px 40px 40px;">
                      <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 600; color: #f1f5f9;">Verify your login</h2>
                      <p style="margin: 0 0 30px; font-size: 16px; line-height: 24px; color: #cbd5e1;">
                        Please use the following verification code to complete your sign-in process. If you didn't request this code, you can safely ignore this email.
                      </p>
                      
                      <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 30px;">
                        <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #60a5fa; text-shadow: 0 0 20px rgba(96, 165, 250, 0.4);">
                          ${otp}
                        </span>
                      </div>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center">
                            <p style="margin: 0; font-size: 14px; font-weight: 500; color: #ef4444; background-color: rgba(239, 68, 68, 0.1); padding: 8px 16px; border-radius: 999px; display: inline-block; border: 1px solid rgba(239, 68, 68, 0.2);">
                              ⏱️ This code expires in 1 minute
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #0f172a; border-top: 1px solid #334155; text-align: center;">
                      <p style="margin: 0; font-size: 13px; color: #64748b;">
                        &copy; ${new Date().getFullYear()} IP Guardian. All rights reserved.<br>
                        This is an automated message, please do not reply.
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
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("OTP Email sent successfully: %s", info.messageId)
  } catch (error) {
    console.error("Error sending OTP email:", error)
    throw new Error("Failed to send verification email.")
  }
}

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
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
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Password Reset Email sent successfully: %s", info.messageId)
  } catch (error) {
    console.error("Error sending Password Reset email:", error)
    throw new Error("Failed to send reset email.")
  }
}
