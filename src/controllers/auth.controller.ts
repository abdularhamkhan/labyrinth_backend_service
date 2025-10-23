import { Request, Response } from "express";
import {
  signupService,
  loginService,
  verifyOtpService,
  forgotPasswordService,
  forgotUsernameService,
  resetPasswordService,
  resendOtpService,
} from "../services/auth.service";
import {
  signupSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  forgotUsernameSchema,
  // Note: resend OTP uses same email schema as forgot password
} from "../schemas/auth.schema";
import { z } from "zod";

// Schema for resend OTP (reuse email validation)
const resendOtpSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

/**
 * =============================================================================
 * AUTH CONTROLLERS - HANDLING AUTHENTICATION LOGIC
 * =============================================================================
 *
 * These controllers orchestrate the authentication flow by:
 * 1. Validating incoming request data using Zod schemas
 * 2. Invoking services for business logic processing
 * 3. Handling success and error responses
 *
 * Follows a consistent pattern of:
 * - Input validation
 * - Service invocation
 * - Response construction
 * - Error handling
 *
 * =============================================================================
 */

/**
 * =============================================================================
 * USER SIGNUP CONTROLLER
 * =============================================================================
 *
 * Handles user registration by:
 * - Validating signup input data
 * - Calling signup service
 * - Sending success response with verification requirement
 *
 * Route: POST /api/auth/signup
 *
 * =============================================================================
 */
export const signupController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = signupSchema.parse(req.body);
  const result = await signupService(req, validatedData);

  res.status(201).json({
    success: true,
    message: result.message,
    data: {
      requiresVerification: true,
      userId: result.id,
    },
  });
};

/**
 * =============================================================================
 * RESEND OTP CONTROLLER
 * =============================================================================
 *
 * Handles OTP resend requests by:
 * - Validating email input
 * - Calling resend OTP service
 * - Sending consistent success response (prevents user enumeration)
 *
 * Route: POST /api/auth/resend-otp
 *
 * Security Features:
 * - No user enumeration (same response for valid/invalid emails)
 * - Rate limiting applied at route level
 * - OTP cooldown protection
 *
 * =============================================================================
 */
export const resendOtpController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = resendOtpSchema.parse(req.body);
  const result = await resendOtpService(req, validatedData.email);

  res.status(200).json({
    success: true,
    message: result.message,
    data: {
      emailSent: true,
    },
  });
};
/**
 * =============================================================================
 * VERIFY OTP CONTROLLER
 * =============================================================================
 *
 * Handles OTP verification by:
 * - Validating OTP input data
 * - Calling OTP verification service
 * - Sending success response with JWT token
 *
 * Route: POST /api/auth/verify-otp
 *
 * =============================================================================
 */
export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = verifyOtpSchema.parse(req.body);
  const { id, username, token } = await verifyOtpService(req, validatedData);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: {
      user: { id, username },
      token,
    },
  });
};

/**
 * =============================================================================
 * LOGIN CONTROLLER
 * =============================================================================
 *
 * Handles user authentication by:
 * - Validating login input data
 * - Calling login service
 * - Sending success response with JWT token
 *
 * Route: POST /api/auth/login
 *
 * =============================================================================
 */
export const loginController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = loginSchema.parse(req.body);
  const { id, username, token } = await loginService(req, validatedData);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: { id, username },
      token,
    },
  });
};

/**
 * =============================================================================
 * FORGOT PASSWORD CONTROLLER
 * =============================================================================
 *
 * Handles password reset requests by:
 * - Validating email input
 * - Calling forgot password service
 * - Sending consistent success response (prevents user enumeration)
 *
 * Route: POST /api/auth/forgot-password
 *
 * Security Features:
 * - No user enumeration (same response for valid/invalid emails)
 * - Rate limiting applied at route level
 * - Secure token generation and email sending
 *
 * =============================================================================
 */
export const forgotPasswordController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = forgotPasswordSchema.parse(req.body);
  const result = await forgotPasswordService(req, validatedData);

  res.status(200).json({
    success: true,
    message: result.message,
    data: {
      emailSent: true,
    },
  });
};

/**
 * =============================================================================
 * RESET PASSWORD CONTROLLER
 * =============================================================================
 *
 * Handles password reset completion by:
 * - Validating token and new password
 * - Calling reset password service
 * - Sending success response with user information
 *
 * Route: POST /api/auth/reset-password
 *
 * Security Features:
 * - Token validation with expiration
 * - Single-use tokens
 * - Session invalidation after password change
 * - Secure password hashing
 *
 * =============================================================================
 */
export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = resetPasswordSchema.parse(req.body);
  const result = await resetPasswordService(req, validatedData);

  res.status(200).json({
    success: true,
    message: result.message,
    data: {
      passwordReset: true,
      userId: result.userId,
    },
  });
};

/* =============================================================================
 * FORGOT USERNAME CONTROLLER
 * =============================================================================
 *
 * Handles username recovery requests by:
 * - Validating email input
 * - Calling forgot username service
 * - Sending consistent success response (prevents user enumeration)
 *
 * Route: POST /api/auth/forgot-username
 *
 * Security Features:
 * - No user enumeration (same response for valid/invalid emails)
 * - Rate limiting applied at route level
 * - Secure token generation and email sending
 *
 * =============================================================================
 */
export const forgotUsernameController = async (req: Request, res: Response): Promise<void> => {
  const validatedData = forgotUsernameSchema.parse(req.body);
  const result = await forgotUsernameService(validatedData);

  res.status(200).json({
    success: true,
    message: result?.message,
    data: {
      emailSent: true,
    },
  });
};
