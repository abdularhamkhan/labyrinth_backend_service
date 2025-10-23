import crypto from "crypto";

/**
 * =============================================================================
 * CRYPTOGRAPHIC UTILITIES FOR SECURE TOKEN HANDLING
 * =============================================================================
 *
 * This module provides cryptographic functions for:
 * - Secure token generation
 * - Token hashing for safe database storage
 * - Hash verification for token validation
 *
 * Security Features:
 * - Cryptographically secure random token generation
 * - SHA-256 hashing with salt for database storage
 * - Constant-time comparison to prevent timing attacks
 *
 * =============================================================================
 */

/**
 * Generate a cryptographically secure random token
 * @param bytes - Number of bytes to generate (default: 32)
 * @returns Hex-encoded token string
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Hash a token with SHA-256 for secure database storage
 * @param token - The raw token to hash
 * @param salt - Optional salt (if not provided, uses token as salt)
 * @returns SHA-256 hash of the token
 */
export function hashToken(token: string, salt?: string): string {
  const actualSalt = salt || token;
  return crypto
    .createHash("sha256")
    .update(token + actualSalt)
    .digest("hex");
}

/**
 * Verify a token against its hash using constant-time comparison
 * @param token - The raw token to verify
 * @param hash - The stored hash to compare against
 * @param salt - Optional salt used during hashing
 * @returns True if token matches the hash
 */
export function verifyToken(token: string, hash: string, salt?: string): boolean {
  const computedHash = hashToken(token, salt);

  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(hash, "hex"));
}

/**
 * Generate a secure token and its hash for database storage
 * @param bytes - Number of bytes for token generation
 * @returns Object with raw token and its hash
 */
export function generateTokenPair(bytes: number = 32): {
  token: string;
  hash: string;
} {
  const token = generateSecureToken(bytes);
  const hash = hashToken(token);

  return { token, hash };
}

/**
 * Generate a secure password reset token with proper hashing
 * @returns Object with token for sending to user and hash for database
 */
export function generatePasswordResetToken(): {
  resetToken: string;
  resetTokenHash: string;
} {
  const { token, hash } = generateTokenPair(32);

  return {
    resetToken: token,
    resetTokenHash: hash,
  };
}

/**
 * Verify a password reset token against stored hash
 * @param token - Token received from user
 * @param storedHash - Hash stored in database
 * @returns True if token is valid
 */
export function verifyPasswordResetToken(token: string, storedHash: string): boolean {
  return verifyToken(token, storedHash);
}
