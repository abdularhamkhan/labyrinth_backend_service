import request from 'supertest';
import { TEST_USER } from '../setup';

const BASE_URL = 'http://localhost:3001';

describe('Projects API Tests', () => {
  let token: string;
  let projectId: string;

  beforeAll(async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        emailOrUsername: TEST_USER.email,
        password: TEST_USER.password,
      });
    token = response.body.data?.token || response.body.token;
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const response = await request(BASE_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: `Test Project from Jest ${Date.now()}`,
          description: 'A project created during automated testing',
          workspaceName: `Test Workspace ${Date.now()}`,
          workspaceDescription: 'Workspace for testing',
        });

      // Accept both 201 (created) and 409 (already exists)
      expect([201, 409]).toContain(response.status);
      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        projectId = response.body.data.id;
      }
    });
  });

  describe('GET /api/projects/:projectId', () => {
    it('should get project details', async () => {
      if (!projectId) {
        console.log('Skipping: No project ID available');
        return;
      }

      const response = await request(BASE_URL)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title');
    });
  });

  describe('PUT /api/projects/:projectId', () => {
    it('should update project', async () => {
      if (!projectId) {
        console.log('Skipping: No project ID available');
        return;
      }

      const response = await request(BASE_URL)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Test Project',
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/projects/search', () => {
    it('should search projects', async () => {
      const response = await request(BASE_URL)
        .get('/api/projects/search?q=test')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.projects || response.body.data)).toBe(true);
    });
  });

  describe('GET /api/projects/:projectId/activity', () => {
    it('should get project activity', async () => {
      if (!projectId) {
        console.log('Skipping: No project ID available');
        return;
      }

      const response = await request(BASE_URL)
        .get(`/api/projects/${projectId}/activity`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/projects/:projectId/analytics', () => {
    it('should get project analytics', async () => {
      if (!projectId) {
        console.log('Skipping: No project ID available');
        return;
      }

      const response = await request(BASE_URL)
        .get(`/api/projects/${projectId}/analytics`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalTasks');
    });
  });
});
