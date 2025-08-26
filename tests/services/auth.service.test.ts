import { ZodError } from 'zod';
// Mock Supabase first
const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    verifyOtp: jest.fn(),
    signInWithPassword: jest.fn(),
  },
};

jest.mock('../../src/config/supabase', () => mockSupabase);

// Mock Prisma
const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock('../../src/config/prisma', () => ({
  prisma: mockPrisma,
}));

// Mock error constants
jest.mock('../../src/constants/error', () => ({
  AUTH_ERRORS: {
    SIGNUP_FAILED: { message: 'Signup failed', code: 'SIGNUP_FAILED' },
    OTP_INVALID: { message: 'Invalid OTP', code: 'OTP_INVALID' },
    INVALID_CREDENTIALS: { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
  },
  USER_ERRORS: {
    EMAIL_ALREADY_EXISTS: { message: 'Email exists', code: 'EMAIL_EXISTS' },
    USERNAME_ALREADY_EXISTS: { message: 'Username exists', code: 'USERNAME_EXISTS' },
    USER_NOT_FOUND: { message: 'User not found', code: 'USER_NOT_FOUND' },
  },
  ValidationError: class extends Error { constructor(message: string, code: string) { super(message); } },
  AuthenticationError: class extends Error { constructor(message: string, code: string, details?: any) { super(message); } },
  ConflictError: class extends Error { constructor(message: string, code: string) { super(message); } },
  NotFoundError: class extends Error { constructor(message: string, code: string) { super(message); } },
}));

// Import services after mocking
import { loginService, signupService, verifyOtpService } from '../../src/services/auth.service';

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test cases for signupService
  describe('signupService', () => {
    it('should return requiresVerification on successful signup', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockSupabase.auth.signUp.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
      
      const result = await signupService({
        userEmail: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result).toEqual({
        id: '123',
        message: 'Sign up complete. Please verify your email via OTP sent to you.',
        requiresVerification: true,
      });
    });
  });

  // Test cases for verifyOtpService
  describe('verifyOtpService', () => {
    it('should return user and token on successful OTP verification', async () => {
      mockSupabase.auth.verifyOtp.mockResolvedValue({ data: { session: { access_token: 'test-token' } }, error: null });
      mockPrisma.user.findUnique.mockResolvedValue({ id: '123', username: 'testuser' });
      
      const result = await verifyOtpService({ email: 'test@example.com', otp: '123456' });

      expect(result).toEqual({
        id: '123',
        username: 'testuser',
        token: 'test-token',
      });
    });

    it('should throw AuthenticationError on invalid OTP', async () => {
      mockSupabase.auth.verifyOtp.mockResolvedValue({ data: { session: null }, error: { message: 'Invalid OTP' } });
      
      await expect(verifyOtpService({ email: 'test@example.com', otp: 'wrong-otp' })).rejects.toThrow('Invalid OTP');
    });
  });

  // Test cases for loginService
  describe('loginService', () => {
    it('should return user and token on successful login', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ id: '123', email: 'test@example.com', username: 'testuser' });
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: { access_token: 'test-token' } }, error: null });
      
      const result = await loginService({ emailOrUsername: 'test@example.com', password: 'password123' });

      expect(result).toEqual({
        id: '123',
        username: 'testuser',
        token: 'test-token',
      });
    });

    it('should throw AuthenticationError on invalid credentials', async () => {
      mockPrisma.user.findFirst.mockResolvedValue({ id: '123', email: 'test@example.com', username: 'testuser' });
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: { message: 'Invalid credentials' } });
      
      await expect(loginService({ emailOrUsername: 'test@example.com', password: 'wrong-password' })).rejects.toThrow('Invalid credentials');
    });
  });
});
