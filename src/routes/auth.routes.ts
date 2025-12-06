import { Router } from "express";
import {
  signupController,
  loginController,
  verifyOtpController,
  forgotPasswordController,
  forgotUsernameController,
  resetPasswordController,
  resendOtpController,
  verifyOtpResetController,
} from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/error.middleware";
import { rateLimitMiddleware } from "../utils/accountSecurity";

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

const router = Router();

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
 * Rate Limited: 3 attempts per hour per IP
 */
router.post("/signup", rateLimitMiddleware("signup"), asyncHandler(signupController));

/**
 * EMAIL VERIFICATION
 *
 * Endpoint: POST /api/auth/verify-otp
 * Body: { email, otp }
 * Response: { message, user, token }
 *
 * Verifies OTP and returns JWT token for authentication
 * Rate Limited: 5 attempts per 10 minutes per IP
 */
router.post("/verify-otp", rateLimitMiddleware("otp"), asyncHandler(verifyOtpController));

/**
 * USER LOGIN
 *
 * Endpoint: POST /api/auth/login
 * Body: { emailOrUsername, password }
 * Response: { message, user, token }
 *
 * Authenticates user and returns JWT token
 * Rate Limited: 10 attempts per 5 minutes per IP
 */
router.post("/login", rateLimitMiddleware("login"), asyncHandler(loginController));

/**
 * FORGOT PASSWORD
 *
 * Endpoint: POST /api/auth/forgot-password
 * Body: { email }
 * Response: { message, emailSent: true }
 *
 * Initiates password reset process by sending 6-digit OTP to email
 * Note: Returns success message regardless of email existence for security
 * Rate Limited: 3 attempts per hour per IP
 */
router.post(
  "/forgot-password",
  rateLimitMiddleware("passwordReset"),
  asyncHandler(forgotPasswordController)
);

/**
 * VERIFY OTP FOR PASSWORD RESET
 *
 * Endpoint: POST /api/auth/verify-otp-reset
 * Body: { email, otp }
 * Response: { message, verificationToken, expiresIn }
 *
 * Step 2 of 3-step password reset: Verifies OTP and returns verification token
 * The verification token is required for the final reset step
 * Rate Limited: 5 attempts per 10 minutes per IP
 */
router.post(
  "/verify-otp-reset",
  rateLimitMiddleware("otp"),
  asyncHandler(verifyOtpResetController)
);

/**
 * RESET PASSWORD
 *
 * Endpoint: POST /api/auth/reset-password
 * Body: { email, password, verificationToken }
 * Response: { message, passwordReset: true, userId }
 *
 * Step 3 of 3-step password reset: Sets new password using verification token
 * Completes password reset using secure token validation from OTP verification step
 * Invalidates all existing user sessions for security
 */
router.post("/reset-password", asyncHandler(resetPasswordController));

/**
 * FORGOT USERNAME
 *
 * Endpoint: POST /api/auth/forgot-username (CHANGED FROM GET TO POST FOR SECURITY)
 * Body: { email }
 * Response: { message, emailSent: true }
 *
 * Initiates username recovery process by sending username via email
 * Note: Returns success message regardless of email existence for security
 * Rate Limited: 3 attempts per hour per IP
 */
router.post(
  "/forgot-username",
  rateLimitMiddleware("passwordReset"),
  asyncHandler(forgotUsernameController)
);

/**
 * RESEND OTP
 *
 * Endpoint: POST /api/auth/resend-otp
 * Body: { email }
 * Response: { message, emailSent: true }
 *
 * Resends OTP for users who didn't receive the initial signup verification email
 * Rate Limited: 3 attempts per hour per IP (same as other auth operations)
 */
router.post("/resend-otp", rateLimitMiddleware("passwordReset"), asyncHandler(resendOtpController));

export default router;
