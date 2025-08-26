import z from "zod";
import { VALIDATION_ERRORS } from "../constants/error";

/**
 * =============================================================================
 * AUTH SCHEMAS - INPUT VALIDATION
 * =============================================================================
 *
 * These schemas validate incoming request data for authentication endpoints.
 * Using Zod for runtime type checking and validation with centralized constants.
 *
 * Benefits:
 * - Type safety at runtime
 * - Consistent validation rules
 * - Centralized error messages
 * - Data sanitization
 * - Easy to extend and modify
 *
 * =============================================================================
 */

/**
 * SIGNUP SCHEMA
 *
 * Validates user registration data.
 * Used by: signupController
 *
 * Required fields:
 * - userEmail: Valid email address
 * - username: At least 3 characters (updated from 8)
 * - password: At least 8 characters with strength requirements
 * - firstName: User's first name
 * - lastName: User's last name
 *
 * Optional fields:
 * - phone: International phone number format
 */
export const signupSchema = z.object({
  userEmail: z
    .string()
    .max(255, "Email must not exceed 255 characters")
    .email(VALIDATION_ERRORS.INVALID_EMAIL_FORMAT.message),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, VALIDATION_ERRORS.INVALID_USERNAME_FORMAT.message)
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, VALIDATION_ERRORS.INVALID_PASSWORD_FORMAT.message),

  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must not exceed 50 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "First name can only contain letters, spaces, apostrophes, and hyphens"
    )
    .trim(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must not exceed 50 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      "Last name can only contain letters, spaces, apostrophes, and hyphens"
    )
    .trim(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must not exceed 20 characters")
    .regex(/^\+?[1-9]\d{1,14}$/, VALIDATION_ERRORS.INVALID_PHONE_FORMAT.message)
    .optional()
    .or(z.literal("")),
});

export type signupInputTypes = z.infer<typeof signupSchema>;

/**
 * LOGIN SCHEMA
 *
 * Validates user login credentials.
 * Used by: loginController
 *
 * Required fields:
 * - emailOrUsername: Email or username for login
 * - password: User's password
 */
export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type loginInputTypes = z.infer<typeof loginSchema>;

/**
 * VERIFY OTP SCHEMA
 *
 * Validates OTP verification data.
 * Used by: verifyOtpController
 *
 * Required fields:
 * - email: Email address for OTP verification
 * - otp: 6-digit OTP code
 */
export const verifyOtpSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export type verifyOtpInputTypes = z.infer<typeof verifyOtpSchema>;

/**
 * FORGOT PASSWORD SCHEMA
 *
 * Validates email for initiating password reset.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export type forgotPasswordInputTypes = z.infer<typeof forgotPasswordSchema>;

/**
 * RESET PASSWORD SCHEMA
 *
 * Validates token and new password for resetting password.
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(20, "Invalid reset token"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, VALIDATION_ERRORS.INVALID_PASSWORD_FORMAT.message),
});

export type resetPasswordInputTypes = z.infer<typeof resetPasswordSchema>;
