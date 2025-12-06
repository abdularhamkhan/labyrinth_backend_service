import nodemailer from "nodemailer";
import { ENV } from "./env";

/**
 * =============================================================================
 * AMAZON SES SMTP CONFIGURATION
 * =============================================================================
 *
 * Nodemailer configuration for Amazon SES SMTP interface.
 * 
 * Requirements:
 * 1. Verify your sender email in AWS SES Console
 * 2. Create SMTP credentials in SES Console
 * 3. Add credentials to .env file
 *
 * SES Regions:
 * - us-east-1: email-smtp.us-east-1.amazonaws.com
 * - us-west-2: email-smtp.us-west-2.amazonaws.com
 * - eu-west-1: email-smtp.eu-west-1.amazonaws.com
 * - See full list: https://docs.aws.amazon.com/ses/latest/dg/regions.html
 *
 * =============================================================================
 */

// Create reusable transporter
export const sesTransporter = nodemailer.createTransport({
  host: ENV.sesSmtpHost,
  port: ENV.sesSmtpPort,
  secure: false, // Use TLS
  auth: {
    user: ENV.sesSmtpUser,
    pass: ENV.sesSmtpPassword,
  },
  // Connection timeout
  connectionTimeout: 5000,
  // Debug logs (disable in production)
  debug: ENV.nodeEnv === "development",
  logger: ENV.nodeEnv === "development",
});

/**
 * Verify SES connection on startup
 */
export const verifySESConnection = async (): Promise<boolean> => {
  try {
    await sesTransporter.verify();
    console.log("✅ Amazon SES SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Amazon SES SMTP connection failed:", error);
    console.error("ℹ️  Please check your SES_SMTP_* credentials in .env");
    return false;
  }
};

/**
 * Email sending interface
 */
export interface SESEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

/**
 * Send email via Amazon SES SMTP
 */
export const sendSESEmail = async (options: SESEmailOptions): Promise<any> => {
  try {
    const mailOptions = {
      from: `"${ENV.sesFromName}" <${ENV.sesFromEmail}>`,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    const info = await sesTransporter.sendMail(mailOptions);

    console.log("📧 Email sent successfully:", {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });

    return {
      success: true,
      messageId: info.messageId,
      provider: "amazon-ses",
    };
  } catch (error) {
    console.error("❌ Failed to send email via SES:", error);
    throw error;
  }
};

/**
 * Send OTP email (for signup/login verification)
 */
export const sendOTPEmail = async (
  to: string,
  otp: string,
  purpose: "signup" | "login" | "password-reset"
): Promise<any> => {
  const subjects = {
    signup: "Verify Your Email - Labyrinth",
    login: "Login Verification Code - Labyrinth",
    "password-reset": "Password Reset Code - Labyrinth",
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2D3748; margin: 0;">Labyrinth</h1>
        <p style="color: #718096; margin: 5px 0;">Verification Code</p>
      </div>
      
      <div style="background: #F7FAFC; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #2D3748; margin-top: 0;">Your Verification Code</h2>
        <p style="color: #4A5568; line-height: 1.6;">
          Use the code below to complete your ${purpose === "signup" ? "sign up" : purpose === "login" ? "login" : "password reset"}.
        </p>
        <div style="background: white; border: 2px solid #E2E8F0; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #2D3748; font-size: 16px;">Your verification code is:</p>
          <p style="margin: 10px 0 0 0; color: #1A365D; font-size: 32px; font-weight: bold; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</p>
        </div>
        <p style="color: #4A5568; line-height: 1.6; font-size: 14px;">
          This code will expire in <strong>10 minutes</strong>.
        </p>
        <p style="color: #E53E3E; line-height: 1.6; font-size: 14px; margin-top: 20px;">
          <strong>Security Notice:</strong> If you didn't request this code, please ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <p style="color: #718096; font-size: 12px;">
          This email was sent to ${to} from Labyrinth Platform.
        </p>
      </div>
    </div>
  `;

  const text = `
Labyrinth - Verification Code

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

---
Labyrinth Team
  `.trim();

  return sendSESEmail({
    to,
    subject: subjects[purpose],
    html,
    text,
  });
};

/**
 * Send username recovery email
 */
export const sendUsernameRecoveryEmail = async (
  to: string,
  username: string
): Promise<any> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2D3748; margin: 0;">Labyrinth</h1>
        <p style="color: #718096; margin: 5px 0;">Username Recovery</p>
      </div>
      
      <div style="background: #F7FAFC; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #2D3748; margin-top: 0;">Your Username</h2>
        <p style="color: #4A5568; line-height: 1.6;">
          You requested to recover your username.
        </p>
        <div style="background: white; border: 2px solid #E2E8F0; border-radius: 6px; padding: 15px; margin: 15px 0; text-align: center;">
          <p style="margin: 0; color: #2D3748; font-size: 14px;">Your username is:</p>
          <p style="margin: 5px 0 0 0; color: #1A365D; font-size: 18px; font-weight: bold;">${username}</p>
        </div>
        <p style="color: #4A5568; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <p style="color: #718096; font-size: 12px;">
          This email was sent to ${to} from Labyrinth Platform.
        </p>
      </div>
    </div>
  `;

  const text = `
Labyrinth - Username Recovery

Your username is: ${username}

If you didn't request this, you can safely ignore this email.

---
Labyrinth Team
  `.trim();

  return sendSESEmail({
    to,
    subject: "Your Username - Labyrinth",
    html,
    text,
  });
};
