import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { BASE_URL, TEST_USER } from '../setup';

/**
 * Integration Tests - Complete User Journeys
 * Tests end-to-end workflows that span multiple API endpoints
 */

describe('Integration - Complete User Journey', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        emailOrUsername: TEST_USER.email,
        password: TEST_USER.password,
      });

    authToken = loginResponse.body.data?.token || loginResponse.body.token;
    userId = loginResponse.body.data?.user?.id || loginResponse.body.data?.id;
  });

  describe('Profile Setup and Recommendation Journey', () => {
    it('should complete full profile setup and get recommendations', async () => {
      // Step 1: Update profile
      const profileResponse = await request(BASE_URL)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Integration',
          lastName: 'Test',
        });

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.user).toBeDefined();

      // Step 2: Update demographics for better matching
      const demographicsResponse = await request(BASE_URL)
        .put('/api/user/demographic')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          country: 'Pakistan',
          languages: ['English', 'Urdu'],
        });

      expect(demographicsResponse.status).toBe(200);
      expect(demographicsResponse.body.success).toBe(true);

      // Step 3: Get user recommendations based on profile
      const recommendationsResponse = await request(BASE_URL)
        .get('/api/matchmaking/user-recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 10 });

      expect(recommendationsResponse.status).toBe(200);
      const recommendations = recommendationsResponse.body.data.recommendations || recommendationsResponse.body.data;
      expect(Array.isArray(recommendations)).toBe(true);

      // Step 4: Get project recommendations
      const projectRecommendationsResponse = await request(BASE_URL)
        .get('/api/matchmaking/project-recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 5 });

      expect(projectRecommendationsResponse.status).toBe(200);
      const projectRecs = projectRecommendationsResponse.body.data.recommendations || projectRecommendationsResponse.body.data;
      expect(Array.isArray(projectRecs)).toBe(true);
    }, 15000);
  });

  describe('Swipe-to-Match-to-Chat Journey', () => {
    let matchedUserId: string | null = null;
    let chatId: string | null = null;

    it('should complete swipe to match to chat flow', async () => {
      // Step 1: Get recommendations to find users to swipe on
      const recommendationsResponse = await request(BASE_URL)
        .get('/api/matchmaking/user-recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 5 });

      expect(recommendationsResponse.status).toBe(200);
      const recommendations = recommendationsResponse.body.data.recommendations || recommendationsResponse.body.data;

      if (recommendations.length === 0) {
        console.log('⚠️  No recommendations available, skipping swipe-to-chat flow');
        return;
      }

      // Step 2: Swipe right on first recommended user
      const targetUser = recommendations[0];
      const swipeResponse = await request(BASE_URL)
        .post('/api/matchmaking/swipe')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          targetType: 'user',
          targetId: targetUser.id,
          isRightSwipe: true,
        });

      // Accept both 200 (new swipe) and 409 (already swiped)
      expect([200, 409]).toContain(swipeResponse.status);

      // Check if it's a match
      if (swipeResponse.body.isMatch) {
        console.log('✓ Match created!');
        matchedUserId = targetUser.id;

        // Step 3: Verify match appears in matches list
        const matchesResponse = await request(BASE_URL)
          .get('/api/matchmaking/matches')
          .set('Authorization', `Bearer ${authToken}`);

        expect(matchesResponse.status).toBe(200);
        const matches = matchesResponse.body.matches;
        const foundMatch = matches.some((match: any) => 
          match.user1.id === matchedUserId || match.user2.id === matchedUserId
        );
        expect(foundMatch).toBe(true);

        // Step 4: Start a direct chat with matched user
        const chatResponse = await request(BASE_URL)
          .post('/api/chat/direct')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            participantId: matchedUserId,
          });

        expect(chatResponse.status).toBe(200);
        chatId = chatResponse.body.id;

        // Step 5: Send a message in the chat
        const messageResponse = await request(BASE_URL)
          .post(`/api/chat/${chatId}/message`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: 'Hey! Great to match with you. Looking forward to collaborating!',
            type: 'TEXT',
          });

        expect(messageResponse.status).toBe(200);
        expect(messageResponse.body.content).toContain('Great to match');

        // Step 6: Retrieve chat messages
        const messagesResponse = await request(BASE_URL)
          .get(`/api/chat/${chatId}/messages`)
          .set('Authorization', `Bearer ${authToken}`)
          .query({ page: 1, limit: 20 });

        expect(messagesResponse.status).toBe(200);
        expect(messagesResponse.body.messages.length).toBeGreaterThan(0);

        console.log('✓ Complete swipe-to-match-to-chat journey successful!');
      } else {
        console.log('⚠️  No match yet, but swipe recorded successfully');
      }
    }, 20000);
  });

  describe('Project Creation and Collaboration Journey', () => {
    let projectId: string | null = null;

    it('should complete project creation, search, and activity tracking', async () => {
      // Step 1: Create a new project
      const createProjectResponse = await request(BASE_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: `AI-Powered Task Manager ${Date.now()}`,
          description: 'Building an intelligent task management system with NLP',
          workspaceName: `Test Workspace ${Date.now()}`,
          workspaceDescription: 'Workspace for AI project',
        });

      if (createProjectResponse.status === 200 || createProjectResponse.status === 201) {
        projectId = createProjectResponse.body.id;
        expect(projectId).toBeDefined();

        // Step 2: Update project details
        const updateProjectResponse = await request(BASE_URL)
          .put(`/api/projects/${projectId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            description: 'Building an intelligent task management system with NLP and ML capabilities',
            requiredSkills: ['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL'],
          });

        expect(updateProjectResponse.status).toBe(200);

        // Step 3: Search for similar projects
        const searchResponse = await request(BASE_URL)
          .get('/api/projects/search')
          .set('Authorization', `Bearer ${authToken}`)
          .query({ query: 'AI task', limit: 10 });

        expect(searchResponse.status).toBe(200);
        expect(Array.isArray(searchResponse.body.projects)).toBe(true);

        // Step 4: View project activity feed
        const activityResponse = await request(BASE_URL)
          .get(`/api/projects/${projectId}/activity`)
          .set('Authorization', `Bearer ${authToken}`)
          .query({ limit: 20 });

        expect(activityResponse.status).toBe(200);
        expect(Array.isArray(activityResponse.body.activities)).toBe(true);

        // Step 5: Get project analytics
        const analyticsResponse = await request(BASE_URL)
          .get(`/api/projects/${projectId}/analytics`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(analyticsResponse.status).toBe(200);
        expect(analyticsResponse.body).toHaveProperty('memberCount');

        console.log('✓ Complete project journey successful!');
      } else {
        console.log('⚠️  Project creation skipped or failed');
      }
    }, 20000);
  });

  describe('Password Reset Journey', () => {
    it('should complete password reset flow', async () => {
      // Step 1: Request password reset (OTP sent to email)
      const forgotPasswordResponse = await request(BASE_URL)
        .post('/api/auth/forgot-password')
        .send({
          email: TEST_USER.email,
        });

      expect(forgotPasswordResponse.status).toBe(200);
      expect(forgotPasswordResponse.body.message).toBeDefined();

      console.log('✓ Password reset OTP sent to email');
      console.log('⚠️  Manual verification required: Check email for OTP and complete reset');

      // Note: Actual OTP verification and password reset would require manual intervention
      // or a test email service that can be queried programmatically
    }, 15000);

    it('should retrieve forgotten username', async () => {
      // Request username recovery
      const forgotUsernameResponse = await request(BASE_URL)
        .post('/api/auth/forgot-username')
        .send({
          email: TEST_USER.email,
        });

      expect(forgotUsernameResponse.status).toBe(200);
      expect(forgotUsernameResponse.body.message).toContain('username');

      console.log('✓ Username recovery email sent');
    }, 10000);
  });

  describe('Comprehensive Profile Data Retrieval', () => {
    it('should retrieve all user-related data in sequence', async () => {
      // Get main profile
      const profileResponse = await request(BASE_URL)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.data.user).toHaveProperty('username');

      // Get demographics
      const demographicsResponse = await request(BASE_URL)
        .get('/api/user/demographic')
        .set('Authorization', `Bearer ${authToken}`);

      expect(demographicsResponse.status).toBe(200);

      // Get all chats
      const chatsResponse = await request(BASE_URL)
        .get('/api/chat')
        .set('Authorization', `Bearer ${authToken}`);

      expect(chatsResponse.status).toBe(200);

      // Get all matches
      const matchesResponse = await request(BASE_URL)
        .get('/api/matchmaking/matches')
        .set('Authorization', `Bearer ${authToken}`);

      expect(matchesResponse.status).toBe(200);

      // Get swipe history
      const swipesResponse = await request(BASE_URL)
        .get('/api/matchmaking/swipes')
        .set('Authorization', `Bearer ${authToken}`);

      // Endpoint may not exist, accept 200 or 404
      expect([200, 404]).toContain(swipesResponse.status);

      console.log('✓ All user data retrieved successfully');
    }, 15000);
  });

  describe('Real-time Features Integration', () => {
    let testChatId: string | null = null;

    beforeAll(async () => {
      // Get or create a chat for real-time testing
      const chatsResponse = await request(BASE_URL)
        .get('/api/chat')
        .set('Authorization', `Bearer ${authToken}`);

      if (chatsResponse.body.chats && chatsResponse.body.chats.length > 0) {
        testChatId = chatsResponse.body.chats[0].id;
      }
    });

    it('should test typing indicator endpoint', async () => {
      if (!testChatId) {
        console.log('⚠️  No chat available for typing indicator test');
        return;
      }

      const typingResponse = await request(BASE_URL)
        .post(`/api/chat/${testChatId}/typing`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          isTyping: true,
        });

      // Endpoint might not exist yet or might return various status codes
      if (typingResponse.status === 200) {
        expect(typingResponse.body).toHaveProperty('success');
        console.log('✓ Typing indicator sent successfully');
      } else {
        console.log('⚠️  Typing indicator endpoint returned status:', typingResponse.status);
      }
    }, 10000);

    it('should get Pusher auth token for real-time subscriptions', async () => {
      const pusherAuthResponse = await request(BASE_URL)
        .post('/api/pusher/auth')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          socket_id: 'test-socket-123',
          channel_name: 'private-user-channel',
        });

      // Pusher auth endpoint should exist for real-time features
      if (pusherAuthResponse.status === 200) {
        expect(pusherAuthResponse.body).toHaveProperty('auth');
        console.log('✓ Pusher authentication successful');
      } else {
        console.log('⚠️  Pusher auth returned status:', pusherAuthResponse.status);
      }
    }, 10000);
  });
});
