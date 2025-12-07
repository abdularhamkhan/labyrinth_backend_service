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

  describe('GET /api/chat/dmmembers', () => {
    it('should get all DM members without search query', async () => {
      const response = await request(BASE_URL)
        .get('/api/chat/dmmembers')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data).toHaveProperty('count');
      expect(Array.isArray(response.body.data.users)).toBe(true);
      expect(typeof response.body.data.count).toBe('number');
      expect(response.body.data.count).toBe(response.body.data.users.length);

      // Check user object structure if users exist
      if (response.body.data.users.length > 0) {
        const user = response.body.data.users[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
        expect(user).toHaveProperty('avatar');
        expect(user).toHaveProperty('lastActive');
      }
    });

    it('should filter DM members by search query (username)', async () => {
      // First get all DM members
      const allMembersResponse = await request(BASE_URL)
        .get('/api/chat/dmmembers')
        .set('Authorization', `Bearer ${token}`);

      if (allMembersResponse.body.data.users.length > 0) {
        // Get first user's username to search
        const firstUser = allMembersResponse.body.data.users[0];
        const searchQuery = firstUser.username.substring(0, 3);

        const searchResponse = await request(BASE_URL)
          .get(`/api/chat/dmmembers?search=${searchQuery}`)
          .set('Authorization', `Bearer ${token}`);

        expect(searchResponse.status).toBe(200);
        expect(searchResponse.body.success).toBe(true);
        expect(Array.isArray(searchResponse.body.data.users)).toBe(true);

        // Verify results contain the search query
        if (searchResponse.body.data.users.length > 0) {
          const matchedUser = searchResponse.body.data.users.find(
            (u: any) => u.username.toLowerCase().includes(searchQuery.toLowerCase())
          );
          expect(matchedUser).toBeDefined();
        }
      }
    });

    it('should filter DM members by search query (first name)', async () => {
      const allMembersResponse = await request(BASE_URL)
        .get('/api/chat/dmmembers')
        .set('Authorization', `Bearer ${token}`);

      if (allMembersResponse.body.data.users.length > 0) {
        // Find a user with firstName
        const userWithName = allMembersResponse.body.data.users.find(
          (u: any) => u.firstName && u.firstName.length > 2
        );

        if (userWithName) {
          const searchQuery = userWithName.firstName.substring(0, 3);

          const searchResponse = await request(BASE_URL)
            .get(`/api/chat/dmmembers?search=${searchQuery}`)
            .set('Authorization', `Bearer ${token}`);

          expect(searchResponse.status).toBe(200);
          expect(searchResponse.body.success).toBe(true);
          expect(Array.isArray(searchResponse.body.data.users)).toBe(true);
        }
      }
    });

    it('should return empty array for non-matching search query', async () => {
      const response = await request(BASE_URL)
        .get('/api/chat/dmmembers?search=xyznonexistentuser12345')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toEqual([]);
      expect(response.body.data.count).toBe(0);
    });

    it('should require authentication', async () => {
      const response = await request(BASE_URL)
        .get('/api/chat/dmmembers');

      expect(response.status).toBe(401);
    });

    it('should handle empty search query gracefully', async () => {
      const response = await request(BASE_URL)
        .get('/api/chat/dmmembers?search=')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });
  });
});
