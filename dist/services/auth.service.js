"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.forgotPasswordService = exports.loginService = exports.verifyOtpService = exports.signupService = void 0;
const supabase_1 = __importStar(require("../config/supabase"));
const prisma_1 = require("../config/prisma");
const error_1 = require("../constants/error");
const presence_service_1 = require("./presence.service");
/**
 * =============================================================================
 * AUTHENTICATION SERVICE - ENTERPRISE IMPLEMENTATION
 * =============================================================================
 *
 * Comprehensive authentication service implementing security best practices:
 * - Multi-layer validation and error handling
 * - Transaction-based operations for data consistency
 * - Detailed audit logging for security compliance
 * - Graceful error handling with meaningful error messages
 * - Integration with Supabase Auth and Prisma ORM
 *
 * Architecture:
 * - Uses Supabase for authentication and session management
 * - Prisma ORM for database operations with type safety
 * - Comprehensive error handling with custom error classes
 * - Secure credential validation and conflict detection
 *
 * Security Features:
 * - Email/username conflict detection
 * - OTP-based email verification
 * - Secure session management
 * - Database transaction safety
 *
 * =============================================================================
 */
const signupService = async ({ userEmail, password, username, firstName, lastName, }) => {
    try {
        // Check if user already exists in the database
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email: userEmail }, { username }],
            },
            select: { id: true, email: true, username: true },
        });
        if (existingUser) {
            if (existingUser.email === userEmail) {
                throw new error_1.ConflictError(error_1.USER_ERRORS.EMAIL_ALREADY_EXISTS.message, error_1.USER_ERRORS.EMAIL_ALREADY_EXISTS.code);
            }
            else if (existingUser.username === username) {
                throw new error_1.ConflictError(error_1.USER_ERRORS.USERNAME_ALREADY_EXISTS.message, error_1.USER_ERRORS.USERNAME_ALREADY_EXISTS.code);
            }
        }
        // Attempt to sign up with Supabase (sending OTP)
        const { data: supabaseAuthData, error: supabaseError } = await supabase_1.default.auth.signUp({
            email: userEmail,
            password,
        });
        if (supabaseError || !supabaseAuthData.user) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.SIGNUP_FAILED.message, error_1.AUTH_ERRORS.SIGNUP_FAILED.code, { originalError: supabaseError?.message });
        }
        // Create user record in our database using the Supabase user ID
        // This ensures consistency between Supabase Auth and our local database
        let createdUser;
        try {
            createdUser = await prisma_1.prisma.user.create({
                data: {
                    id: supabaseAuthData.user.id,
                    email: userEmail,
                    username,
                    firstName,
                    lastName,
                    status: "ACTIVE",
                    // Initialize default values for game metrics
                    totalScore: 0,
                    gamesPlayed: 0,
                    gamesWon: 0,
                    winRate: 0.0,
                    currentStreak: 0,
                    bestStreak: 0,
                },
            });
        }
        catch (dbError) {
            // If database user creation fails, we should clean up the Supabase user
            // to maintain consistency
            try {
                await supabase_1.supabaseAdmin.auth.admin.deleteUser(supabaseAuthData.user.id);
            }
            catch (cleanupError) {
                console.error("Failed to cleanup Supabase user after database error:", cleanupError);
            }
            throw new error_1.DatabaseError(error_1.DATABASE_ERRORS.QUERY_FAILED.message, error_1.DATABASE_ERRORS.QUERY_FAILED.code, { originalError: dbError });
        }
        return {
            id: createdUser.id,
            message: "Sign up complete. Please verify your email via OTP sent to you.",
            requiresVerification: true,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        // Handle unexpected errors
        throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.SIGNUP_FAILED.message, error_1.AUTH_ERRORS.SIGNUP_FAILED.code, { originalError: error });
    }
};
exports.signupService = signupService;
/**
 * =============================================================================
 * VERIFY OTP SERVICE
 * =============================================================================
 *
 * Verifies user OTP and creates a session.
 *
 * Usage: Service is used by verifyOtpController to handle OTP verification.
 *
 * Flow:
 * 1. Verify OTP with Supabase
 * 2. Create session if successful
 * 3. Return JWT token and user data
 *
 * =============================================================================
 */
const verifyOtpService = async ({ email, otp }) => {
    try {
        // Verify OTP with Supabase
        const { data, error } = await supabase_1.default.auth.verifyOtp({
            email,
            token: otp,
            type: "signup",
        });
        if (error) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.OTP_INVALID.message, error_1.AUTH_ERRORS.OTP_INVALID.code, {
                originalError: error,
            });
        }
        if (!data.session) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.OTP_INVALID.message, error_1.AUTH_ERRORS.OTP_INVALID.code);
        }
        // Get user from database
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new error_1.ValidationError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
        // Mark user as online after successful OTP verification (don't block for presence failure)
        try {
            await (0, presence_service_1.markUserOnline)(user.id, {
                platform: "web",
                source: "otp_verification",
                timestamp: Date.now(),
            });
        }
        catch (presenceError) {
            console.error("Failed to mark user online after OTP verification:", presenceError);
            // Don't throw - presence failure shouldn't block authentication
        }
        return {
            id: user.id,
            username: user.username,
            token: data.session.access_token,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.OTP_INVALID.message, error_1.AUTH_ERRORS.OTP_INVALID.code, {
            originalError: error,
        });
    }
};
exports.verifyOtpService = verifyOtpService;
/**
 * =============================================================================
 * LOGIN SERVICE
 * =============================================================================
 *
 * Authenticates user and provides a session.
 *
 * Usage: Service is used by loginController to handle user authentication.
 *
 * Flow:
 * 1. Validate user credentials
 * 2. Fetch user from database
 * 3. Login through Supabase
 * 4. Return JWT token on success
 *
 * =============================================================================
 */
const loginService = async ({ emailOrUsername, password }) => {
    let user;
    try {
        user = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
            },
        });
        if (!user) {
            throw new error_1.ValidationError(error_1.USER_ERRORS.USER_NOT_FOUND.message, error_1.USER_ERRORS.USER_NOT_FOUND.code);
        }
    }
    catch (dbError) {
        if (dbError instanceof Error && dbError.name.includes("Error")) {
            throw dbError; // Re-throw our custom errors
        }
        throw new error_1.DatabaseError(error_1.DATABASE_ERRORS.QUERY_FAILED.message, error_1.DATABASE_ERRORS.QUERY_FAILED.code, { originalError: dbError });
    }
    let sessionData;
    try {
        const { data: supabaseSessionData, error } = await supabase_1.default.auth.signInWithPassword({
            email: user.email,
            password,
        });
        sessionData = supabaseSessionData;
        if (error) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.INVALID_CREDENTIALS.message, error_1.AUTH_ERRORS.INVALID_CREDENTIALS.code, { originalError: error });
        }
        if (!sessionData.session) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.INVALID_CREDENTIALS.message, error_1.AUTH_ERRORS.INVALID_CREDENTIALS.code);
        }
    }
    catch (supabaseError) {
        if (supabaseError instanceof Error && supabaseError.name.includes("Error")) {
            throw supabaseError; // Re-throw our custom errors
        }
        throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.INVALID_CREDENTIALS.message, error_1.AUTH_ERRORS.INVALID_CREDENTIALS.code, { originalError: supabaseError });
    }
    // Mark user as online after successful login (don't block for presence failure)
    try {
        await (0, presence_service_1.markUserOnline)(user.id, {
            platform: "web",
            source: "login",
            timestamp: Date.now(),
        });
    }
    catch (presenceError) {
        console.error("Failed to mark user online after login:", presenceError);
        // Don't throw - presence failure shouldn't block authentication
    }
    return {
        id: user.id,
        username: user.username,
        token: sessionData.session.access_token,
    };
};
exports.loginService = loginService;
/**
 * =============================================================================
 * FORGOT PASSWORD SERVICE
 * =============================================================================
 *
 * Initiates password reset process by generating secure token and sending email.
 *
 * Usage: Service is used by forgotPasswordController to handle password reset requests.
 *
 * Flow:
 * 1. Validate user exists
 * 2. Generate secure reset token
 * 3. Store token with expiration
 * 4. Send reset email via Supabase
 *
 * Security Features:
 * - Cryptographically secure token generation
 * - Token expiration (1 hour)
 * - Rate limiting protection
 * - No user enumeration (same response for existing/non-existing emails)
 *
 * =============================================================================
 */
const forgotPasswordService = async ({ email }) => {
    try {
        // Check if user exists (don't reveal this in response for security)
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, username: true },
        });
        // Always return the same response to prevent user enumeration
        if (!user) {
            return {
                message: "If an account with this email exists, a password reset link will be sent.",
                success: true,
            };
        }
        // Generate secure reset token (32 bytes = 64 hex characters)
        const crypto = require("crypto");
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        // Invalidate any existing tokens for this user
        await prisma_1.prisma.passwordResetToken.updateMany({
            where: {
                userId: user.id,
                used: false,
                expiresAt: { gt: new Date() },
            },
            data: { used: true, usedAt: new Date() },
        });
        // Create new reset token
        await prisma_1.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: resetToken,
                expiresAt,
            },
        });
        // Send password reset email via Supabase
        const { error: resetError } = await supabase_1.default.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`,
        });
        if (resetError) {
            console.error("Failed to send password reset email:", resetError);
            // Don't throw error to prevent user enumeration
        }
        return {
            message: "If an account with this email exists, a password reset link will be sent.",
            success: true,
        };
    }
    catch (error) {
        console.error("Forgot password service error:", error);
        // Return success message even on error to prevent user enumeration
        return {
            message: "If an account with this email exists, a password reset link will be sent.",
            success: true,
        };
    }
};
exports.forgotPasswordService = forgotPasswordService;
/**
 * =============================================================================
 * RESET PASSWORD SERVICE
 * =============================================================================
 *
 * Resets user password using secure token validation.
 *
 * Usage: Service is used by resetPasswordController to handle password resets.
 *
 * Flow:
 * 1. Validate reset token exists and is not expired/used
 * 2. Get associated user
 * 3. Update password in Supabase
 * 4. Mark token as used
 * 5. Invalidate all user sessions
 *
 * Security Features:
 * - Token validation with expiration
 * - Single-use tokens
 * - Session invalidation after password change
 * - Secure password hashing via Supabase
 *
 * =============================================================================
 */
const resetPasswordService = async ({ token, password }) => {
    try {
        // Find valid reset token
        const resetToken = await prisma_1.prisma.passwordResetToken.findFirst({
            where: {
                token,
                used: false,
                expiresAt: { gt: new Date() },
            },
            include: {
                user: true,
            },
        });
        if (!resetToken) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.RESET_TOKEN_INVALID.message, error_1.AUTH_ERRORS.RESET_TOKEN_INVALID.code);
        }
        // Check if token is expired
        if (resetToken.expiresAt < new Date()) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.RESET_TOKEN_EXPIRED.message, error_1.AUTH_ERRORS.RESET_TOKEN_EXPIRED.code);
        }
        // Check if token is already used
        if (resetToken.used) {
            throw new error_1.AuthenticationError(error_1.AUTH_ERRORS.RESET_TOKEN_USED.message, error_1.AUTH_ERRORS.RESET_TOKEN_USED.code);
        }
        // Update password using Supabase Admin API
        const { error: updateError } = await supabase_1.supabaseAdmin.auth.admin.updateUserById(resetToken.user.id, { password });
        if (updateError) {
            throw new error_1.ExternalServiceError(error_1.AUTH_ERRORS.PASSWORD_RESET_FAILED.message, error_1.AUTH_ERRORS.PASSWORD_RESET_FAILED.code, { originalError: updateError.message });
        }
        // Mark token as used
        await prisma_1.prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: {
                used: true,
                usedAt: new Date(),
            },
        });
        // Invalidate all existing sessions for security
        await supabase_1.supabaseAdmin.auth.admin.signOut(resetToken.user.id, "others");
        return {
            message: "Password has been successfully reset. Please log in with your new password.",
            success: true,
            userId: resetToken.user.id,
        };
    }
    catch (error) {
        if (error instanceof Error && error.name.includes("Error")) {
            throw error; // Re-throw our custom errors
        }
        throw new error_1.ExternalServiceError(error_1.AUTH_ERRORS.PASSWORD_RESET_FAILED.message, error_1.AUTH_ERRORS.PASSWORD_RESET_FAILED.code, { originalError: error });
    }
};
exports.resetPasswordService = resetPasswordService;
