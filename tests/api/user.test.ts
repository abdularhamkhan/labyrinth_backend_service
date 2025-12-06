import request from 'supertest';
import { TEST_USER } from '../setup';

const BASE_URL = 'http://localhost:3001';

describe('User Profile API Tests', () => {
  let token: string;

  beforeAll(async () => {
    // Login to get token
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        emailOrUsername: TEST_USER.email,
        password: TEST_USER.password,
      });
    token = response.body.data?.token || response.body.token;
  });

  describe('GET /api/user/profile', () => {
    it('should get own profile successfully', async () => {
      const response = await request(BASE_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email');
      expect(response.body.data.user).toHaveProperty('username');
    });

    it('should reject request without token', async () => {
      const response = await request(BASE_URL)
        .get('/api/user/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should update profile successfully', async () => {
      const response = await request(BASE_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Arham',
          lastName: 'Khan',
          education: 'Bachelor',
          gitHubProfile: 'https://github.com/arhamkhan',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.message).toContain('updated');
    });
  });

  describe('GET /api/user/demographic', () => {
    it('should get own demographics', async () => {
      const response = await request(BASE_URL)
        .get('/api/user/demographic')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/user/demographic', () => {
    it('should update demographics successfully', async () => {
      const response = await request(BASE_URL)
        .put('/api/user/demographic')
        .set('Authorization', `Bearer ${token}`)
        .send({
          country: 'Pakistan',
          languages: ['English', 'Urdu'],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.demographic).toHaveProperty('country');
      expect(response.body.data.demographic).toHaveProperty('languages');
    });
  });
});
