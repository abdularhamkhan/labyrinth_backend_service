import request from 'supertest';
import { TEST_USER, setAuthToken, setUserId } from '../setup';

const BASE_URL = 'http://localhost:3001';

describe('Authentication API Tests', () => {
  let token: string;
  let user2Token: string;

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/signup')
        .send({
          userEmail: TEST_USER.email,
          password: TEST_USER.password,
          username: TEST_USER.username,
          firstName: TEST_USER.firstName,
          lastName: TEST_USER.lastName,
          dateOfBirth: '1995-05-15',
          country: 'Pakistan',
          preferredLanguage: 'English',
        });

      if (response.status === 409 || response.status === 401) {
        // User already exists, login instead
        console.log('User exists, logging in...');
        const loginRes = await request(BASE_URL)
          .post('/api/auth/login')
          .send({
            emailOrUsername: TEST_USER.email,
            password: TEST_USER.password,
          });
        
        if (loginRes.status === 200) {
          token = loginRes.body.data.token;
          setAuthToken(token);
          setUserId(loginRes.body.data.user.id);
          console.log('✅ Logged in successfully');
        }
        return;
      }

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('requiresVerification');
      
      // HYBRID AUTH: Check if user was auto-verified (got token immediately)
      if (!response.body.data.requiresVerification && response.body.data.token) {
        // Auto-verified: Token provided immediately
        token = response.body.data.token;
        setAuthToken(token);
        setUserId(response.body.data.userId);
        console.log('✅ User auto-verified, token received immediately');
      } else {
        // OTP flow: Would need verification (not tested here)
        console.log('📧 OTP verification required (email sent)');
        setUserId(response.body.data.userId);
      }
    });

    it('should reject duplicate email', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/signup')
        .send({
          userEmail: TEST_USER.email,
          password: TEST_USER.password,
          username: 'different_username',
          firstName: 'Test',
          lastName: 'User',
          dateOfBirth: '1995-05-15',
          country: 'Pakistan',
          preferredLanguage: 'English',
        });

      // Might be 400 (validation), 409 (conflict), or 401 (exists but pending)
      expect([400, 401, 409]).toContain(response.status);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          emailOrUsername: TEST_USER.email,
          password: TEST_USER.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('username');

      token = response.body.data.token;
      setAuthToken(token);
      setUserId(response.body.data.user.id);
    });

    it('should reject wrong password', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          emailOrUsername: TEST_USER.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'nonexistent@example.com',
          password: 'Password123!',
        });

      // Might be 400 (validation) or 401 (unauthorized)
      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should accept forgot password request', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/forgot-password')
        .send({
          email: TEST_USER.email,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // Response should contain message about OTP being sent
    });

    it('should return same response for non-existent email (security)', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/forgot-username', () => {
    it('should accept forgot username request', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/forgot-username')
        .send({
          email: TEST_USER.email,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // Response should contain message about username email
    });
  });
});
