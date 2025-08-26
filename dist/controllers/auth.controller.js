"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.forgotPasswordController = exports.loginController = exports.verifyOtpController = exports.signupController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../schemas/auth.schema");
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
const signupController = async (req, res) => {
    const validatedData = auth_schema_1.signupSchema.parse(req.body);
    const result = await (0, auth_service_1.signupService)(validatedData);
    res.status(201).json({
        success: true,
        message: result.message,
        data: {
            requiresVerification: true,
            userId: result.id,
        },
    });
};
exports.signupController = signupController;
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
const verifyOtpController = async (req, res) => {
    const validatedData = auth_schema_1.verifyOtpSchema.parse(req.body);
    const { id, username, token } = await (0, auth_service_1.verifyOtpService)(validatedData);
    res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: {
            user: { id, username },
            token,
        },
    });
};
exports.verifyOtpController = verifyOtpController;
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
const loginController = async (req, res) => {
    const validatedData = auth_schema_1.loginSchema.parse(req.body);
    const { id, username, token } = await (0, auth_service_1.loginService)(validatedData);
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: { id, username },
            token,
        },
    });
};
exports.loginController = loginController;
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
const forgotPasswordController = async (req, res) => {
    const validatedData = auth_schema_1.forgotPasswordSchema.parse(req.body);
    const result = await (0, auth_service_1.forgotPasswordService)(validatedData);
    res.status(200).json({
        success: true,
        message: result.message,
        data: {
            emailSent: true,
        },
    });
};
exports.forgotPasswordController = forgotPasswordController;
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
const resetPasswordController = async (req, res) => {
    const validatedData = auth_schema_1.resetPasswordSchema.parse(req.body);
    const result = await (0, auth_service_1.resetPasswordService)(validatedData);
    res.status(200).json({
        success: true,
        message: result.message,
        data: {
            passwordReset: true,
            userId: result.userId,
        },
    });
};
exports.resetPasswordController = resetPasswordController;
