"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyOtpSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const error_1 = require("../constants/error");
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
exports.signupSchema = zod_1.default.object({
    userEmail: zod_1.default
        .string()
        .max(255, "Email must not exceed 255 characters")
        .email(error_1.VALIDATION_ERRORS.INVALID_EMAIL_FORMAT.message),
    username: zod_1.default
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must not exceed 50 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, error_1.VALIDATION_ERRORS.INVALID_USERNAME_FORMAT.message)
        .trim()
        .toLowerCase(),
    password: zod_1.default
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, error_1.VALIDATION_ERRORS.INVALID_PASSWORD_FORMAT.message),
    firstName: zod_1.default
        .string()
        .min(1, "First name is required")
        .max(50, "First name must not exceed 50 characters")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "First name can only contain letters, spaces, apostrophes, and hyphens")
        .trim(),
    lastName: zod_1.default
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must not exceed 50 characters")
        .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Last name can only contain letters, spaces, apostrophes, and hyphens")
        .trim(),
    phone: zod_1.default
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must not exceed 20 characters")
        .regex(/^\+?[1-9]\d{1,14}$/, error_1.VALIDATION_ERRORS.INVALID_PHONE_FORMAT.message)
        .optional()
        .or(zod_1.default.literal("")),
});
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
exports.loginSchema = zod_1.default.object({
    emailOrUsername: zod_1.default.string().min(1, "Email or username is required"),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters"),
});
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
exports.verifyOtpSchema = zod_1.default.object({
    email: zod_1.default.string().email("Please provide a valid email address"),
    otp: zod_1.default.string().length(6, "OTP must be exactly 6 digits"),
});
/**
 * FORGOT PASSWORD SCHEMA
 *
 * Validates email for initiating password reset.
 */
exports.forgotPasswordSchema = zod_1.default.object({
    email: zod_1.default.string().email("Please provide a valid email address"),
});
/**
 * RESET PASSWORD SCHEMA
 *
 * Validates token and new password for resetting password.
 */
exports.resetPasswordSchema = zod_1.default.object({
    token: zod_1.default.string().min(20, "Invalid reset token"),
    password: zod_1.default
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, error_1.VALIDATION_ERRORS.INVALID_PASSWORD_FORMAT.message),
});
