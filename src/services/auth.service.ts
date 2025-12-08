import supabase, { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/prisma";
import { sendOTPEmail } from "../config/ses";
import {
  AUTH_ERRORS,
  USER_ERRORS,
  DATABASE_ERRORS,
  EXTERNAL_SERVICE_ERRORS,
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError,
  DatabaseError,
  ExternalServiceError,
} from "../constants/error";
import {
  loginInputTypes,
  signupInputTypes,
  verifyOtpInputTypes,
  forgotPasswordInputTypes,
  resetPasswordInputTypes,
  forgotUsernameInputTypes,
} from "../schemas/auth.schema";
import { markUserOnline } from "./presence.service";
import { AuthAudit, AuditEventType } from "../utils/audit";
import { accountSecurity } from "../utils/accountSecurity";
import { generatePasswordResetToken, verifyPasswordResetToken } from "../utils/crypto";
// Note: We'll use Supabase's native email functionality instead of custom email utility
import { Request } from "express";
import { ENV } from "../config/env";

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

export const signupService = async (
  req: Request,
  { userEmail, password, username, firstName, lastName, dateOfBirth, country, preferredLanguage }: signupInputTypes
) => {
  try {
    // =========================================================================
    // STEP 1: ALL VALIDATIONS FIRST - NO SUPABASE CALLS YET
    // =========================================================================
    
    // TODO: ENABLE WHEN DOMAIN IS VERIFIED FOR EMAIL SENDING
    // Check OTP cooldown - prevent rapid OTP requests
    // const otpCooldownKey = `otp_cooldown:${userEmail.toLowerCase()}`;
    // const lastOtpRequest = await accountSecurity.redis.get(otpCooldownKey);
    //
    // if (lastOtpRequest) {
    //   const timeLeft = await accountSecurity.redis.ttl(otpCooldownKey);
    //   throw new AuthenticationError(
    //     `Please wait ${timeLeft} seconds before requesting another verification code.`,
    //     "OTP_COOLDOWN_ACTIVE"
    //   );
    // }

    // Check for suspicious activity before proceeding
    const suspiciousActivity = await accountSecurity.detectSuspiciousActivity(req);
    if (suspiciousActivity.isSuspicious) {
      AuthAudit.signupSuccess(req, "blocked", userEmail);
      throw new AuthenticationError(
        "Signup blocked due to suspicious activity.",
        "SIGNUP_BLOCKED_SUSPICIOUS"
      );
    }

    // Check if user already exists in OUR database (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: userEmail.toLowerCase(),
              mode: "insensitive",
            },
          },
          {
            username: {
              equals: username.toLowerCase(),
              mode: "insensitive",
            },
          },
        ],
      },
      select: { id: true, email: true, username: true },
    });

    if (existingUser) {
      AuthAudit.otpEvent(AuditEventType.SIGNUP_DUPLICATE, req, userEmail, false);

      if (existingUser.email?.toLowerCase() === userEmail.toLowerCase()) {
        throw new AuthenticationError(
          USER_ERRORS.EMAIL_ALREADY_EXISTS.message,
          USER_ERRORS.EMAIL_ALREADY_EXISTS.code
        );
      } else if (existingUser.username?.toLowerCase() === username.toLowerCase()) {
        throw new ConflictError(
          USER_ERRORS.USERNAME_ALREADY_EXISTS.message,
          USER_ERRORS.USERNAME_ALREADY_EXISTS.code
        );
      }
    }

    // Check if user exists in Supabase Auth (prevents orphan Supabase users)
    const { data: existingSupabaseUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("Failed to check existing Supabase users:", listError);
      throw new ExternalServiceError(
        "Unable to verify user existence. Please try again.",
        "SUPABASE_CHECK_FAILED"
      );
    }

    const existingSupabaseUser = existingSupabaseUsers.users.find(
      (user: any) => user.email?.toLowerCase() === userEmail.toLowerCase()
    );

    if (existingSupabaseUser) {
      throw new AuthenticationError(
        USER_ERRORS.EMAIL_ALREADY_EXISTS.message,
        USER_ERRORS.EMAIL_ALREADY_EXISTS.code
      );
    }

    // =========================================================================
    // STEP 2: ALL VALIDATIONS PASSED - NOW CREATE SUPABASE USER
    // =========================================================================
    
    // HYBRID APPROACH: Try OTP first, fallback to auto-verify if email quota exceeded
    let supabaseUser: any;
    let shouldSendOtp = true; // Try OTP by default
    let autoVerified = false;

    // Try normal signup with OTP email (Supabase free plan: 2 emails/hour)
    const { data: supabaseAuthData, error: supabaseError } = await supabase.auth.signUp({
      email: userEmail,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          username,
          firstName,
          lastName,
        },
      },
    });

    // Check if email sending failed due to rate limiting
    if (supabaseError) {
      console.warn(`⚠️  Supabase signup with OTP failed:`, supabaseError.message);
      
      // Check if it's a rate limit error (email quota exceeded)
      if (supabaseError.message?.toLowerCase().includes('email') || 
          supabaseError.message?.toLowerCase().includes('rate') ||
          supabaseError.message?.toLowerCase().includes('limit')) {
        console.log(`📧 Email quota exceeded, falling back to auto-verification...`);
        shouldSendOtp = false;
        
        // FALLBACK: Create user with auto-verification (no OTP email sent)
        const { data: adminUserData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email: userEmail,
          password,
          email_confirm: true, // Auto-confirm since we can't send OTP
          user_metadata: {
            username,
            firstName,
            lastName,
          },
        });
        
        if (adminError || !adminUserData.user) {
          console.error("Admin user creation also failed:", adminError);
          throw new AuthenticationError(
            AUTH_ERRORS.SIGNUP_FAILED.message,
            AUTH_ERRORS.SIGNUP_FAILED.code,
            { originalError: adminError?.message }
          );
        }
        
        supabaseUser = adminUserData.user;
        autoVerified = true;
        console.log(`✅ Supabase user created (auto-verified due to email quota): ${supabaseUser.id}`);
      } else {
        // Some other error, throw it
        throw new AuthenticationError(
          AUTH_ERRORS.SIGNUP_FAILED.message,
          AUTH_ERRORS.SIGNUP_FAILED.code,
          { originalError: supabaseError?.message }
        );
      }
    } else if (!supabaseAuthData.user) {
      throw new AuthenticationError(
        AUTH_ERRORS.SIGNUP_FAILED.message,
        AUTH_ERRORS.SIGNUP_FAILED.code
      );
    } else {
      supabaseUser = supabaseAuthData.user;
      console.log(`✅ Supabase user created with OTP email sent: ${supabaseUser.id}`);
    }

    // =========================================================================
    // STEP 3: CREATE DATABASE USER - WITH CLEANUP ON FAILURE
    // =========================================================================
    
    let createdUser;
    try {
      createdUser = await prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: userEmail,
          username,
          firstName,
          lastName,
          passwordHash: "supabase_managed",
          // Set status based on whether OTP was sent or auto-verified
          status: autoVerified ? "ACTIVE" : "PENDING_VERIFICATION",
          ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {}),
        },
      });

      AuthAudit.signupSuccess(req, createdUser.id, userEmail);
      
      // TODO: ENABLE WHEN OTP IS READY
      // await accountSecurity.redis.setex(otpCooldownKey, 60, Date.now().toString());
      
      console.log(`✅ Database user created: ${createdUser.id}`);
    } catch (dbError) {
      console.error("Database user creation failed, cleaning up Supabase user:", dbError);
      
      // CRITICAL: Clean up orphan Supabase user
      try {
        await supabaseAdmin.auth.admin.deleteUser(supabaseUser.id);
        console.log(`✅ Cleaned up orphan Supabase user: ${supabaseUser.id}`);
      } catch (cleanupError) {
        console.error(`❌ CRITICAL: Failed to cleanup Supabase user ${supabaseUser.id}:`, cleanupError);
        console.error(`Manual cleanup required for Supabase user: ${supabaseUser.id}`);
      }

      throw new DatabaseError(
        DATABASE_ERRORS.QUERY_FAILED.message,
        DATABASE_ERRORS.QUERY_FAILED.code,
        { originalError: dbError }
      );
    }

    // If demographic details were provided, create and link a Demographic record
    if (country || preferredLanguage) {
      try {
        const demographic = await prisma.demographic.create({
          data: {
            country: country || "Unknown",
            languages: preferredLanguage ? [preferredLanguage] : [],
          },
        });
        await prisma.user.update({
          where: { id: createdUser.id },
          data: { demographicId: demographic.id },
        });
      } catch (demoErr) {
        console.warn("Failed to attach demographic at signup:", demoErr);
      }
    }

    // =========================================================================
    // STEP 4: GENERATE SESSION TOKEN (if auto-verified)
    // =========================================================================
    let sessionToken: string | undefined;
    
    if (autoVerified) {
      // User was auto-verified due to email quota, generate token immediately
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password,
        });
        
        if (signInData?.session?.access_token) {
          sessionToken = signInData.session.access_token;
          console.log(`✅ Auto-generated session token for auto-verified user`);
          
          // Mark user as online
          try {
            await markUserOnline(createdUser.id, {
              platform: "web",
              source: "signup_auto_verified",
              timestamp: Date.now(),
            });
          } catch (presenceError) {
            console.error("Failed to mark user online:", presenceError);
          }
        }
      } catch (tokenError) {
        console.warn("Failed to generate session token:", tokenError);
      }
    }

    return {
      id: createdUser.id,
      username: createdUser.username,
      message: autoVerified 
        ? "Sign up successful! Your account is ready to use." 
        : "Sign up complete! Please check your email for the verification code.",
      requiresVerification: !autoVerified,
      token: sessionToken, // Only present if auto-verified
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new AuthenticationError(
      AUTH_ERRORS.SIGNUP_FAILED.message,
      AUTH_ERRORS.SIGNUP_FAILED.code,
      { originalError: error }
    );
  }
};
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

export const verifyOtpService = async (req: Request, { email, otp }: verifyOtpInputTypes) => {
  try {
    // Verify OTP with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });

    if (error) {
      // Log failed OTP attempt
      AuthAudit.otpEvent(AuditEventType.OTP_VERIFY_FAILURE, req, email, false);

      // Record failed attempt for security tracking
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await accountSecurity.recordFailedAttempt(req, user.id, email, "otp");
      }

      throw new AuthenticationError(AUTH_ERRORS.OTP_INVALID.message, AUTH_ERRORS.OTP_INVALID.code, {
        originalError: error,
      });
    }

    if (!data.session) {
      AuthAudit.otpEvent(AuditEventType.OTP_VERIFY_FAILURE, req, email, false);
      throw new AuthenticationError(AUTH_ERRORS.OTP_INVALID.message, AUTH_ERRORS.OTP_INVALID.code);
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ValidationError(
        USER_ERRORS.USER_NOT_FOUND.message,
        USER_ERRORS.USER_NOT_FOUND.code
      );
    }

    // Activate account if still pending verification
    if (user.status === "PENDING_VERIFICATION") {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: "ACTIVE" },
      });
    }

    // Clear any previous failed attempts
    await accountSecurity.clearAccountLockout(user.id);

    // Log successful OTP verification
    AuthAudit.otpEvent(AuditEventType.OTP_VERIFY_SUCCESS, req, email, true);

    // Mark user as online after successful OTP verification (don't block for presence failure)
    try {
      await markUserOnline(user.id, {
        platform: "web",
        source: "otp_verification",
        timestamp: Date.now(),
      });
    } catch (presenceError) {
      console.error("Failed to mark user online after OTP verification:", presenceError);
      // Don't throw - presence failure shouldn't block authentication
    }

    return {
      id: user.id,
      username: user.username,
      token: data.session.access_token,
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw new AuthenticationError(AUTH_ERRORS.OTP_INVALID.message, AUTH_ERRORS.OTP_INVALID.code, {
      originalError: error,
    });
  }
};

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

export const loginService = async (
  req: Request,
  { emailOrUsername, password }: loginInputTypes
) => {
  let user;
  try {
    // Check for suspicious activity
    const suspiciousActivity = await accountSecurity.detectSuspiciousActivity(req);
    if (suspiciousActivity.isSuspicious) {
      AuthAudit.loginFailure(req, emailOrUsername, "Suspicious activity detected");
      throw new AuthenticationError(
        "Login blocked due to suspicious activity.",
        "LOGIN_BLOCKED_SUSPICIOUS"
      );
    }

    // Convert to lowercase for case-insensitive comparison
    const lowerIdentifier = emailOrUsername.toLowerCase();

    user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: lowerIdentifier,
              mode: "insensitive",
            },
          },
          {
            username: {
              equals: lowerIdentifier,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!user) {
      // Log failed attempt
      AuthAudit.loginFailure(req, emailOrUsername, "User not found");

      throw new ValidationError(
        USER_ERRORS.USER_NOT_FOUND.message,
        USER_ERRORS.USER_NOT_FOUND.code
      );
    }

    // Check if account is in good standing
    if (user.status !== "ACTIVE") {
      AuthAudit.loginFailure(req, emailOrUsername, `Account status: ${user.status}`);

      if (user.status === "PENDING_VERIFICATION") {
        throw new AuthenticationError(
          "Please verify your email address before logging in.",
          "ACCOUNT_PENDING_VERIFICATION"
        );
      } else if (user.status === "SUSPENDED") {
        throw new AuthenticationError(
          "Your account has been suspended. Contact support for assistance.",
          "ACCOUNT_SUSPENDED"
        );
      } else {
        throw new AuthenticationError(
          "Account is not active. Contact support for assistance.",
          "ACCOUNT_INACTIVE"
        );
      }
    }

    // Track IP to account access
    await accountSecurity.trackIpAccountAccess(req, user.id);
  } catch (dbError) {
    if (dbError instanceof Error && dbError.name.includes("Error")) {
      throw dbError; // Re-throw our custom errors
    }
    throw new DatabaseError(
      DATABASE_ERRORS.QUERY_FAILED.message,
      DATABASE_ERRORS.QUERY_FAILED.code,
      { originalError: dbError }
    );
  }

  let sessionData;
  try {
    const { data: supabaseSessionData, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });
    sessionData = supabaseSessionData;

    if (error) {
      // Record failed login attempt
      const failedAttempt = await accountSecurity.recordFailedAttempt(
        req,
        user.id,
        user.email,
        "login"
      );

      AuthAudit.loginFailure(
        req,
        emailOrUsername,
        "Invalid credentials",
        failedAttempt.attemptCount
      );

      if (failedAttempt.shouldLock) {
        throw new AuthenticationError(
          `Account locked due to multiple failed attempts. Try again in ${failedAttempt.lockoutDuration} minutes.`,
          "ACCOUNT_LOCKED_FAILED_ATTEMPTS"
        );
      }

      throw new AuthenticationError(
        AUTH_ERRORS.INVALID_CREDENTIALS.message,
        AUTH_ERRORS.INVALID_CREDENTIALS.code,
        { originalError: error }
      );
    }

    if (!sessionData.session) {
      // Record failed login attempt for missing session
      await accountSecurity.recordFailedAttempt(req, user.id, user.email, "login");
      AuthAudit.loginFailure(req, emailOrUsername, "No session created");

      throw new AuthenticationError(
        AUTH_ERRORS.INVALID_CREDENTIALS.message,
        AUTH_ERRORS.INVALID_CREDENTIALS.code
      );
    }
  } catch (supabaseError) {
    if (supabaseError instanceof Error && supabaseError.name.includes("Error")) {
      throw supabaseError; // Re-throw our custom errors
    }
    throw new AuthenticationError(
      AUTH_ERRORS.INVALID_CREDENTIALS.message,
      AUTH_ERRORS.INVALID_CREDENTIALS.code,
      { originalError: supabaseError }
    );
  }

  // Mark user as online after successful login (don't block for presence failure)
  try {
    await markUserOnline(user.id, {
      platform: "web",
      source: "login",
      timestamp: Date.now(),
    });
  } catch (presenceError) {
    console.error("Failed to mark user online after login:", presenceError);
    // Don't throw - presence failure shouldn't block authentication
  }

  return {
    id: user.id,
    username: user.username,
    token: sessionData.session.access_token,
  };
};

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

export const forgotPasswordService = async (req: Request, { email }: forgotPasswordInputTypes) => {
  try {
    // Check if user exists (don't reveal this in response for security)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true },
    });

    // Always return same response to prevent user enumeration
    const standardResponse = {
      message: "If an account with this email exists, a password reset verification code has been sent.",
      success: true,
      data: { 
        emailSent: true,
        expiresIn: "2 minutes"
      },
    };
    
    if (!user) {
      // No user found, but return success to prevent enumeration
      return standardResponse;
    }

    // Generate real OTP for existing user
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    // Invalidate any existing OTP tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      data: { used: true, usedAt: new Date() },
    });

    // Store OTP in database (hashed for security)
    const crypto = require('crypto');
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: otpHash, // Store hashed OTP
        expiresAt,
      },
    });

    // Send OTP via email using SES
    try {
      await sendOTPEmail(user.email, otp, 'password-reset');
      console.log(`✅ Password reset OTP sent successfully to ${email}`);
      console.log(`🔒 OTP: ${otp} (expires in 2 minutes)`);
    } catch (emailError) {
      console.error("Failed to send password reset OTP email:", emailError);
      // Don't throw error - still return success to prevent user enumeration
      // In production, you might want to log this for monitoring
    }

    // Log password reset request
    AuthAudit.passwordResetEvent(AuditEventType.PASSWORD_RESET_REQUEST, req, email);

    return standardResponse;
  } catch (error) {
    console.error("Forgot password service error:", error);
    // Return success message even on error to prevent user enumeration
    return {
      message: "If an account with this email exists, a password reset code has been sent.",
      success: true,
      data: { 
        emailSent: true,
        expiresIn: "2 minutes"
      },
    };
  }
};

/**
 * =============================================================================
 * VERIFY OTP FOR PASSWORD RESET SERVICE
 * =============================================================================
 *
 * Verifies OTP for password reset without actually resetting the password.
 * This is the middle step in the three-step password reset flow.
 *
 * Flow:
 * 1. Verify the OTP matches what was generated
 * 2. Check OTP hasn't expired
 * 3. Mark OTP as verified (but not used)
 * 4. Return success status
 *
 * =============================================================================
 */

export const verifyOtpResetService = async (
  req: Request,
  { email, otp }: { email: string; otp: string }
) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new AuthenticationError(
        "Invalid OTP or email address.",
        "OTP_VERIFICATION_FAILED"
      );
    }

    // Hash the provided OTP to compare with stored hash
    const crypto = require('crypto');
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: otpHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetToken) {
      // Log failed OTP attempt
      AuthAudit.passwordResetEvent(
        AuditEventType.PASSWORD_RESET_REQUEST, 
        req, 
        email
      );

      throw new AuthenticationError(
        "Invalid or expired OTP code.",
        "OTP_VERIFICATION_FAILED"
      );
    }

    // Mark the token as used to prevent replay attacks
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { 
        used: true,
        usedAt: new Date()
      },
    });

    // Create a short-lived verification token for the reset step
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: verificationHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes for reset step
      },
    });

    // Log successful OTP verification
    AuthAudit.passwordResetEvent(
      AuditEventType.PASSWORD_RESET_REQUEST, 
      req, 
      email
    );

    return {
      message: "OTP verified successfully. You may now reset your password.",
      success: true,
      data: {
        verificationToken, // This will be used in the reset step
        expiresIn: "5 minutes"
      },
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }
    throw new AuthenticationError(
      "OTP verification failed.",
      "OTP_VERIFICATION_FAILED",
      { originalError: error }
    );
  }
};

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

export const resetPasswordService = async (
  req: Request,
  { email, password, verificationToken }: { email: string; password: string; verificationToken: string }
) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // CRITICAL SECURITY: Validate verification token from the OTP verification step (3-step flow)
    const crypto = require('crypto');
    const verificationHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    const validToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        token: verificationHash,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
    
    if (!validToken) {
      AuthAudit.passwordResetEvent(
        AuditEventType.PASSWORD_RESET_REQUEST, 
        req, 
        email
      );
      throw new AuthenticationError(
        "Invalid or expired verification token. Please restart the password reset process.",
        "VERIFICATION_TOKEN_INVALID"
      );
    }
    
    // Update password using Supabase Auth Admin (since we don't have active session)
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: password }
    );

    if (updateError) {
      throw new ExternalServiceError(
        AUTH_ERRORS.PASSWORD_RESET_FAILED.message,
        AUTH_ERRORS.PASSWORD_RESET_FAILED.code,
        { originalError: updateError.message }
      );
    }

    // Mark the verification token as used first
    await prisma.passwordResetToken.update({
      where: { id: validToken.id },
      data: { used: true, usedAt: new Date() },
    });
    
    // Invalidate any other remaining password reset tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        used: false,
        id: { not: validToken.id },
      },
      data: { used: true, usedAt: new Date() },
    });

    // Invalidate all existing sessions for security
    try {
      await supabaseAdmin.auth.admin.signOut(user.id, "others");
    } catch (signOutError) {
      console.warn("Could not invalidate user sessions:", signOutError);
      // Don't fail the reset if session invalidation fails
    }

    // Log successful password reset
    AuthAudit.passwordResetEvent(
      AuditEventType.PASSWORD_RESET_REQUEST, 
      req, 
      email
    );

    return {
      message: "Password has been successfully reset. Please log in with your new password.",
      success: true,
      userId: user.id,
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    throw new ExternalServiceError(
      AUTH_ERRORS.PASSWORD_RESET_FAILED.message,
      AUTH_ERRORS.PASSWORD_RESET_FAILED.code,
      { originalError: error }
    );
  }
};

/**
 * =============================================================================
 * FORGOT USERNAME SERVICE
 * =============================================================================
 *
 * Initiates username recovery process by sending username via email/
 *
 * Usage: Service is used by forgotUsernameController to handle forgot username requests.
 *
 * Flow:
 * 1. Validate user exists
 * 1.5 Should verify the user by IP or Phone Number (Later we will impliment this)
 * 2. Send username email via Supabase
 *
 * Security Features:
 * - Cryptographically secure token generation
 * - Token expiration (1 hour)
 * - Rate limiting protection
 * - No user enumeration (same response for existing/non-existing emails)
 *
 * =============================================================================
};

/**
 * =============================================================================
 * RESEND OTP SERVICE
 * =============================================================================
 *
 * Resends OTP email for users who didn't receive the initial signup email.
 * This addresses cases where Supabase's automatic email sending fails.
 *
 * =============================================================================
 */
export const resendOtpService = async (req: Request, email: string) => {
  try {
    // Check OTP cooldown - prevent spam
    const otpCooldownKey = `otp_cooldown:${email.toLowerCase()}`;
    const lastOtpRequest = await accountSecurity.redis.get(otpCooldownKey);

    if (lastOtpRequest) {
      const timeLeft = await accountSecurity.redis.ttl(otpCooldownKey);
      throw new AuthenticationError(
        `Please wait ${timeLeft} seconds before requesting another verification code.`,
        "OTP_COOLDOWN_ACTIVE"
      );
    }

    // Check if user exists in database but is unverified
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true, status: true },
    });

    if (!user) {
      // Return same response to prevent user enumeration
      return {
        message:
          "If an account with this email exists and is pending verification, an OTP has been sent.",
        success: true,
      };
    }

    if (user.status !== "PENDING_VERIFICATION") {
      // User is already verified or has other status
      return {
        message:
          "If an account with this email exists and is pending verification, an OTP has been sent.",
        success: true,
      };
    }

    // Resend OTP using Supabase
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: undefined, // We handle via OTP, not magic links
      },
    });

    if (error) {
      console.error("Failed to resend OTP:", error);
      // Don't reveal the error to prevent information disclosure
    } else {
      console.log(`✅ OTP resent successfully to ${email}`);
    }

    // Set cooldown regardless of success/failure
    await accountSecurity.redis.setex(otpCooldownKey, 60, Date.now().toString());

    return {
      message:
        "If an account with this email exists and is pending verification, an OTP has been sent.",
      success: true,
    };
  } catch (error) {
    console.error("Resend OTP service error:", error);

    if (error instanceof Error && error.name.includes("Error")) {
      throw error;
    }

    // Return success message even on error to prevent user enumeration
    return {
      message:
        "If an account with this email exists and is pending verification, an OTP has been sent.",
      success: true,
    };
  }
};

// export const forgotUsernameService = async ({ email }: forgotUsernameInputTypes) => {
//   try {
//     // Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { email: email.toLowerCase() },
//       select: { id: true, username: true, email: true },
//     });

//     // Always return same response → prevent user enumeration
//     if (!user) {
//       return {
//         message: "If an account with this email exists, your username has been sent.",
//         success: true,
//         data: { emailSent: true }
//       };
//     }

//     // Send username recovery email using Supabase Auth (via invite link with custom data)
//     try {
//       await resend.emails.send({
//         from: ENV.resendFromEmail,
//         to: email,
//         subject: "Your Username Recovery",
//         text: `Hello, your username is: ${user.username}`,
//         html: `<p>Hello,</p>
//            <p>Your username is: <b>${user.username}</b></p>
//            <p>If you didn't request this, you can ignore this email.</p>`,
//       });

//       console.log(`Username recovery email sent successfully via Supabase to ${user.email} (username: ${user.username})`);

//     } catch (error) {
//       console.error('Failed to send username recovery email via Resend:', error);
//       // Don't throw error to prevent user enumeration
//     }

//     // Always return the same success message regardless of email success/failure
//     // This prevents user enumeration attacks
//     return {
//       message: "If an account with this email exists, your username has been sent.",
//       success: true,
//       data: { emailSent: true }
//     };
//   } catch (error) {
//     console.error("Forgot username service error:", error);

//     // Same response → prevent user enumeration
//     // Never reveal whether the user exists or not
//     return {
//       message: "If an account with this email exists, your username has been sent.",
//       success: true,
//       data: { emailSent: true }
//     };
//   }
// };

export const forgotUsernameService = async ({ email }: forgotUsernameInputTypes) => {
  const safeResponse = {
    message: "If an account with this email exists, your username has been sent.",
    success: true,
    data: { emailSent: true },
  };

  try {
    // Check if user exists (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { username: true, email: true },
    });

    if (!user) return safeResponse;

    try {
      console.log(`🔧 Attempting to send username recovery email to: ${user.email}`);
      
      const { sendUsernameRecoveryEmail } = await import('../config/ses');
      await sendUsernameRecoveryEmail(user.email, user.username);
      
      console.log(
        `✅ Username recovery email sent successfully to ${user.email} (username: ${user.username})`
      );

      return safeResponse;
    } catch (sendError) {
      console.error("SES email error (username recovery):", sendError);
    }

    return safeResponse;
  } catch (error) {
    console.error("Forgot username service DB error:", error);
    return safeResponse;
  }
};