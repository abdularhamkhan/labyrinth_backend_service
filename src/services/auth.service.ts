import supabase, { supabaseAdmin } from "../config/supabase";
import { prisma } from "../config/prisma";
import { resend } from "../config/resend";
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
// Password reset handled entirely by Supabase Auth
// Note: We'll use Supabase's native email functionality instead of custom email utility
import { Request } from "express";
import { ENV } from "../config/env";
import { kafkaProducer } from "./kafka-producer.service";

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
  { userEmail, password, username, firstName, lastName }: signupInputTypes
) => {
  try {
    // Check OTP cooldown - prevent rapid OTP requests
    const otpCooldownKey = `otp_cooldown:${userEmail.toLowerCase()}`;
    const lastOtpRequest = await accountSecurity.redis.get(otpCooldownKey);

    if (lastOtpRequest) {
      const timeLeft = await accountSecurity.redis.ttl(otpCooldownKey);
      throw new AuthenticationError(
        `Please wait ${timeLeft} seconds before requesting another verification code.`,
        "OTP_COOLDOWN_ACTIVE"
      );
    }

    // Check for suspicious activity before proceeding
    const suspiciousActivity = await accountSecurity.detectSuspiciousActivity(req);
    if (suspiciousActivity.isSuspicious) {
      AuthAudit.signupSuccess(req, "blocked", userEmail);
      throw new AuthenticationError(
        "Signup blocked due to suspicious activity.",
        "SIGNUP_BLOCKED_SUSPICIOUS"
      );
    }

    // STEP 1: VALIDATE DATA FIRST - Don't let Supabase create users until validation passes

    // Check if user already exists in the database (case-insensitive)
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
      // Log duplicate signup attempt
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

    // STEP 2: Check if user exists in Supabase Auth (prevents duplicate Supabase users)
    try {
      const { data: existingSupabaseUsers } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000, // This is not ideal for large scale, but works for now
      });

      const existingSupabaseUser = existingSupabaseUsers.users.find(
        (user) => user.email?.toLowerCase() === userEmail.toLowerCase()
      );

      if (existingSupabaseUser) {
        throw new AuthenticationError(
          USER_ERRORS.EMAIL_ALREADY_EXISTS.message,
          USER_ERRORS.EMAIL_ALREADY_EXISTS.code
        );
      }
    } catch (supabaseError) {
      // If we can't check Supabase users, log but don't fail
      console.warn("Could not check existing Supabase users:", supabaseError);
    }

    // STEP 3: NOW attempt to sign up with Supabase (sending OTP)
    const { data: supabaseAuthData, error: supabaseError } = await supabase.auth.signUp({
      email: userEmail,
      password,
      options: {
        // Ensure email confirmation is required
        emailRedirectTo: undefined, // We handle verification via OTP, not magic links
      },
    });

    if (supabaseError || !supabaseAuthData.user) {
      console.error("Supabase signup error:", supabaseError);
      throw new AuthenticationError(
        AUTH_ERRORS.SIGNUP_FAILED.message,
        AUTH_ERRORS.SIGNUP_FAILED.code,
        { originalError: supabaseError?.message }
      );
    }

    // Log signup success for debugging
    console.log(`✅ Supabase user created successfully: ${supabaseAuthData.user.id}`);
    console.log(`📧 Email confirmation should be sent to: ${userEmail}`);

    // Check if user needs email confirmation
    if (supabaseAuthData.user && !supabaseAuthData.user.email_confirmed_at) {
      console.log(
        "📧 User requires email confirmation - OTP should be sent automatically by Supabase"
      );
    } else {
      console.warn(
        "⚠️  User email appears to be pre-confirmed - this might indicate a configuration issue"
      );
    }

    // Create user record in our database using the Supabase user ID
    // This ensures consistency between Supabase Auth and our local database
    let createdUser;
    try {
      createdUser = await prisma.user.create({
        data: {
          id: supabaseAuthData.user.id,
          email: userEmail,
          username,
          firstName,
          lastName,
          passwordHash: "", // Will be set by Supabase
          // Initialize collaboration-related defaults
          maxDailySwipes: 50, // Default daily swipes for matchmaking
          lastActive: new Date(),
        },
      });

      // Log successful signup
      AuthAudit.signupSuccess(req, createdUser.id, userEmail);

      // Publish user registration event to Kafka
      try {
        await kafkaProducer.publishUserRegistered(createdUser.id, {
          email: userEmail,
          username,
          firstName,
          lastName,
          registrationSource: 'direct_signup'
        });
      } catch (kafkaError) {
        console.error('Failed to publish user registration event:', kafkaError);
        // Don't fail registration if Kafka is down
      }

      // Set OTP cooldown (60 seconds)
      const otpCooldownKey = `otp_cooldown:${userEmail.toLowerCase()}`;
      await accountSecurity.redis.setex(otpCooldownKey, 60, Date.now().toString());
    } catch (dbError) {
      // If database user creation fails, we should clean up the Supabase user
      // to maintain consistency
      try {
        await supabaseAdmin.auth.admin.deleteUser(supabaseAuthData.user.id);
      } catch (cleanupError) {
        console.error("Failed to cleanup Supabase user after database error:", cleanupError);
      }

      throw new DatabaseError(
        DATABASE_ERRORS.QUERY_FAILED.message,
        DATABASE_ERRORS.QUERY_FAILED.code,
        { originalError: dbError }
      );
    }

    return {
      id: createdUser.id,
      message: "Sign up complete. Please verify your email via OTP sent to you.",
      requiresVerification: true,
    };
  } catch (error) {
    if (error instanceof Error && error.name.includes("Error")) {
      throw error; // Re-throw our custom errors
    }
    // Handle unexpected errors
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

    // Update user last active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

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

    // Publish user activity event to Kafka
    try {
      await kafkaProducer.publishUserActivity(user.id, 'email_verification_completed', {
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    } catch (kafkaError) {
      console.error('Failed to publish user activity event:', kafkaError);
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

    // Check if user exists and is valid for login
    // Note: In Labyrinth, we rely on Supabase's user verification status

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

  // Publish user activity event to Kafka
  try {
    await kafkaProducer.publishUserActivity(user.id, 'user_login', {
      email: user.email,
      username: user.username,
      loginMethod: 'password',
      timestamp: new Date().toISOString(),
    });
  } catch (kafkaError) {
    console.error('Failed to publish user login event:', kafkaError);
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

    // Always return the same response to prevent user enumeration
    if (!user) {
      return {
        message: "If an account with this email exists, a password reset link will be sent.",
        success: true,
      };
    }

    // We rely on Supabase Auth for token management
    // No need to store tokens in our database

    // Log password reset request
    AuthAudit.passwordResetEvent(AuditEventType.PASSWORD_RESET_REQUEST, req, email);

    // Send password reset OTP (6-digit token) using Supabase Auth
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined, // No redirect = OTP mode (6-digit tokens)
      });

      if (resetError) {
        console.error("Supabase password reset OTP failed:", resetError);
        // Don't throw error to prevent user enumeration
      } else {
        console.log(`✅ Password reset OTP (6-digit) sent successfully to ${email}`);
      }
    } catch (error) {
      console.error("Failed to send password reset OTP via Supabase:", error);
      // Don't throw error to prevent user enumeration
    }

    return {
      message: "If an account with this email exists, a password reset link will be sent.",
      success: true,
      data: { emailSent: true },
    };
  } catch (error) {
    console.error("Forgot password service error:", error);
    // Return success message even on error to prevent user enumeration
    return {
      message: "If an account with this email exists, a password reset link will be sent.",
      success: true,
      data: { emailSent: true },
    };
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
  { email, otp, password }: resetPasswordInputTypes
) => {
  try {
    // Verify OTP with Supabase first
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery", // For password reset OTP
    });

    if (error || !data.user) {
      // Log failed reset attempt
      AuthAudit.passwordResetEvent(AuditEventType.PASSWORD_RESET_REQUEST, req, email);

      throw new AuthenticationError(
        "Invalid or expired OTP code for password reset.",
        "PASSWORD_RESET_OTP_INVALID"
      );
    }

    // Update password using Supabase Auth with the verified session
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      throw new ExternalServiceError(
        AUTH_ERRORS.PASSWORD_RESET_FAILED.message,
        AUTH_ERRORS.PASSWORD_RESET_FAILED.code,
        { originalError: updateError.message }
      );
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError(USER_ERRORS.USER_NOT_FOUND.message, USER_ERRORS.USER_NOT_FOUND.code);
    }

    // Invalidate all existing sessions for security
    await supabaseAdmin.auth.admin.signOut(data.user.id, "others");

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

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true },
    });

    if (!user) {
      // Return same response to prevent user enumeration
      return {
        message:
          "If an account with this email exists and requires verification, an OTP has been sent.",
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
        "If an account with this email exists and requires verification, an OTP has been sent.",
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
        "If an account with this email exists and requires verification, an OTP has been sent.",
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
      console.log(`🔧 Using Resend API Key: ${ENV.resendApiKey ? "SET" : "MISSING"}`);
      console.log(`🔧 From Email: ${ENV.resendFromEmail}`);

      const result = await resend.emails.send({
        from: `${ENV.resendFromName} <${ENV.resendFromEmail}>`,
        to: [user.email],
        subject: "Your Username Recovery - With A Twist",
        text: `Hello, your username is: ${user.username}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p style="font-size: 16px; margin-bottom: 12px;">Hello,</p>

          <p style="margin-bottom: 16px;">
              We found your account details. Your username is:
          </p>

          <p style="
            display: inline-block;
            padding: 10px 16px;
            background-color: #f0f8ff;
            color: #007bff;
            border: 1px solid #007bff;
            border-radius: 6px;
            font-weight: bold;
            font-size: 18px;
            margin: 12px 0;
          ">
            ${user.username}
          </p>
        
          <p style="margin-top: 20px; font-size: 14px; color: #555;">
            If you didn’t request this, you can safely ignore this email.
          </p>
          </div>

        `,
      });

      if (result.error) {
        throw new Error(`Resend API Error: ${result.error.message}`);
      }

      console.log(
        `✅ Username recovery email sent successfully to ${user.email} (username: ${user.username})`
      );
      console.log(`✅ Resend Message ID: ${result.data?.id}`);

      return safeResponse;
    } catch (sendError) {
      console.error("Resend email error (username recovery):", sendError);
    }

    return safeResponse;
  } catch (error) {
    console.error("Forgot username service DB error:", error);
    return safeResponse;
  }
};
