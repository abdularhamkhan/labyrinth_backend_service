import request from 'supertest';
import { TEST_USER } from '../setup';

const BASE_URL = 'http://localhost:3001';

describe('Matchmaking API Tests', () => {
  let token: string;
  let userId: string;
  let recommendedUserId: string;

  beforeAll(async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        emailOrUsername: TEST_USER.email,
        password: TEST_USER.password,
      });
    token = response.body.data?.token || response.body.token;
    userId = response.body.data?.user?.id || response.body.data?.id;
  });

  describe('GET /api/matchmaking/user-recommendations', () => {
    it('should get user recommendations', async () => {
      const response = await request(BASE_URL)
        .get('/api/matchmaking/user-recommendations?limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const dataArray = response.body.data.recommendations || response.body.data;
      expect(Array.isArray(dataArray)).toBe(true);
      
      if (dataArray.length > 0) {
        expect(dataArray[0]).toHaveProperty('compatibilityScore');
        recommendedUserId = dataArray[0].id;
      }
    });
  });

  describe('GET /api/matchmaking/project-recommendations', () => {
    it('should get project recommendations', async () => {
      const response = await request(BASE_URL)
        .get('/api/matchmaking/project-recommendations?limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const dataArray = response.body.data.recommendations || response.body.data;
      expect(Array.isArray(dataArray)).toBe(true);
    });
  });

  describe('POST /api/matchmaking/swipe', () => {
    it('should swipe on a user', async () => {
      if (!recommendedUserId) {
        console.log('Skipping: No recommended user available');
        return;
      }

      const response = await request(BASE_URL)
        .post('/api/matchmaking/swipe')
        .set('Authorization', `Bearer ${token}`)
        .send({
          targetType: 'user',
          targetId: recommendedUserId,
          isRightSwipe: true,
        });

      // Accept both 200 (new swipe) and 409 (already swiped)
      expect([200, 409]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('GET /api/matchmaking/matches', () => {
    it('should get my matches', async () => {
      const response = await request(BASE_URL)
        .get('/api/matchmaking/matches')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const dataArray = response.body.data.matches || response.body.data;
      expect(Array.isArray(dataArray)).toBe(true);
    });
  });

  describe('GET /api/matchmaking/swipe-count', () => {
    it('should get swipe count', async () => {
      const response = await request(BASE_URL)
        .get('/api/matchmaking/swipe-count')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // API returns dailyCount not dailySwipeCount
      expect(response.body.data).toHaveProperty('dailyCount');
    });
  });
});
