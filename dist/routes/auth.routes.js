"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * =============================================================================
 * AUTH ROUTES - PUBLIC AUTHENTICATION ENDPOINTS
 * =============================================================================
 *
 * These routes handle user authentication without requiring existing auth.
 * All routes are public and don't require authentication middleware.
 *
 * Available endpoints:
 * - POST /api/auth/signup - User registration
 * - POST /api/auth/verify-otp - Email verification
 * - POST /api/auth/login - User login
 * - POST /api/auth/forgot-password - Initiate password reset
 * - POST /api/auth/reset-password - Complete password reset
 *
 * =============================================================================
 */
const router = (0, express_1.Router)();
// =============================================================================
// PUBLIC AUTHENTICATION ROUTES
// =============================================================================
/**
 * USER REGISTRATION
 *
 * Endpoint: POST /api/auth/signup
 * Body: { userEmail, username, password, firstName, lastName }
 * Response: { message, requiresVerification: true, userId }
 *
 * Creates new user account and sends OTP for verification
 */
router.post("/signup", (0, error_middleware_1.asyncHandler)(auth_controller_1.signupController));
/**
 * EMAIL VERIFICATION
 *
 * Endpoint: POST /api/auth/verify-otp
 * Body: { email, otp }
 * Response: { message, user, token }
 *
 * Verifies OTP and returns JWT token for authentication
 */
router.post("/verify-otp", (0, error_middleware_1.asyncHandler)(auth_controller_1.verifyOtpController));
/**
 * USER LOGIN
 *
 * Endpoint: POST /api/auth/login
 * Body: { emailOrUsername, password }
 * Response: { message, user, token }
 *
 * Authenticates user and returns JWT token
 */
router.post("/login", (0, error_middleware_1.asyncHandler)(auth_controller_1.loginController));
/**
 * FORGOT PASSWORD
 *
 * Endpoint: POST /api/auth/forgot-password
 * Body: { email }
 * Response: { message, emailSent: true }
 *
 * Initiates password reset process by sending reset email
 * Note: Returns success message regardless of email existence for security
 */
router.post("/forgot-password", (0, error_middleware_1.asyncHandler)(auth_controller_1.forgotPasswordController));
/**
 * RESET PASSWORD
 *
 * Endpoint: POST /api/auth/reset-password
 * Body: { token, password }
 * Response: { message, passwordReset: true, userId }
 *
 * Completes password reset using secure token validation
 */
router.post("/reset-password", (0, error_middleware_1.asyncHandler)(auth_controller_1.resetPasswordController));
exports.default = router;
