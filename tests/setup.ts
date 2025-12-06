// Test setup - runs before all tests
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test timeout
jest.setTimeout(30000);

// Base URL for API tests
export const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

// Manual auth token for testing (set via environment variable)
// Usage: MANUAL_AUTH_TOKEN="your-jwt-token" npm test
export const MANUAL_AUTH_TOKEN = process.env.MANUAL_AUTH_TOKEN || '';

// Global test user credentials (from environment variables)
export const TEST_USER = {
  email: process.env.TEST_EMAIL_ADDRESS || 'abdularhamkhanzada@gmail.com',
  password: process.env.TEST_PASSWORD || 'StrongPassword123!',
  username: 'testuser_arham',
  firstName: 'Arham',
  lastName: 'Khan',
};

// Global test variables (will be populated during tests)
export let authToken: string = '';
export let userId: string = '';
export let chatId: string = '';
export let projectId: string = '';

// Helper function to get auth token (each test file should call this)
export async function getAuthToken(): Promise<string> {
  if (authToken) return authToken;
  
  const request = (await import('supertest')).default;
  
  try {
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        emailOrUsername: TEST_USER.email,
        password: TEST_USER.password,
      });
    
    if (response.status === 200 && response.body.data?.token) {
      authToken = response.body.data.token;
      userId = response.body.data.user.id;
      console.log('✅ Global auth token obtained');
      return authToken;
    }
  } catch (error) {
    console.error('❌ Failed to get auth token:', error);
  }
  
  return authToken;
}

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const setUserId = (id: string) => {
  userId = id;
};

export const setChatId = (id: string) => {
  chatId = id;
};

export const setProjectId = (id: string) => {
  projectId = id;
};
