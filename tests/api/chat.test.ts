import request from 'supertest';
import { TEST_USER } from '../setup';

const BASE_URL = 'http://localhost:3001';

describe('Chat API Tests', () => {
  let token: string;
  let userId: string;
  let chatId: string;
  let messageId: string;

  beforeAll(async () => {
    // Login to get token
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        emailOrUsername: TEST_USER.email,
        password: TEST_USER.password,
      });
    token = response.body.data?.token || response.body.token;
    userId = response.body.data?.user?.id || response.body.data?.id;
  });

  describe('GET /api/chat', () => {
    it('should get all chats for user', async () => {
      const response = await request(BASE_URL)
        .get('/api/chat')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      const dataArray = response.body.data.chats || response.body.data;
      expect(Array.isArray(dataArray)).toBe(true);
    });
  });

  describe('POST /api/chat/direct', () => {
    it('should create or get direct chat', async () => {
      // First, need another user ID - skip if no other user
      const response = await request(BASE_URL)
        .get('/api/matchmaking/user-recommendations?limit=1')
        .set('Authorization', `Bearer ${token}`);

      const recommendationsArray = response.body.data.recommendations || response.body.data;
      if (recommendationsArray && recommendationsArray.length > 0) {
        const targetUserId = recommendationsArray[0].id;

        const chatResponse = await request(BASE_URL)
          .post('/api/chat/direct')
          .set('Authorization', `Bearer ${token}`)
          .send({
            targetUserId: targetUserId,
          });

        if (chatResponse.status === 200) {
          expect(chatResponse.body.success).toBe(true);
          const chat = chatResponse.body.data.chat || chatResponse.body.data;
          expect(chat).toHaveProperty('id');
          chatId = chat.id;
        }
      }
    });
  });

  describe('POST /api/chat/:chatId/messages', () => {
    it('should send a message', async () => {
      if (!chatId) {
        console.log('Skipping: No chat ID available');
        return;
      }

      const response = await request(BASE_URL)
        .post(`/api/chat/${chatId}/messages`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Test message from Jest',
          messageType: 'TEXT',
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body.success).toBe(true);
      const message = response.body.data.message || response.body.data;
      expect(message).toHaveProperty('id');
      expect(message.content).toBe('Test message from Jest');
      messageId = message.id;
    });
  });

  describe('GET /api/chat/:chatId/messages', () => {
    it('should get chat messages', async () => {
      if (!chatId) {
        console.log('Skipping: No chat ID available');
        return;
      }

      const response = await request(BASE_URL)
        .get(`/api/chat/${chatId}/messages?page=1&limit=50`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('messages');
      expect(Array.isArray(response.body.data.messages)).toBe(true);
    });
  });

  describe('POST /api/chat/:chatId/typing', () => {
    it('should set typing indicator', async () => {
      if (!chatId) {
        console.log('Skipping: No chat ID available');
        return;
      }

      const response = await request(BASE_URL)
        .post(`/api/chat/${chatId}/typing`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          isTyping: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
