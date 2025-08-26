import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import {
  getUsersController,
  getOnlineCountController,
  heartbeatController,
  getMyPresenceController,
  getPresenceStatsController,
  searchUsersController,
} from '../../src/controllers/presence.controller';
import * as presenceService from '../../src/services/presence.service';
import { ValidationError } from '../../src/constants/error';
import { AuthenticatedRequest } from '../../src/middlewares/auth.middleware';

/**
 * =============================================================================
 * PRESENCE CONTROLLER TESTS - COMPREHENSIVE COVERAGE
 * =============================================================================
 * 
 * Tests all presence controller functions with:
 * - Request validation and sanitization
 * - Service layer integration
 * - Response formatting
 * - Error handling scenarios
 * - Authentication context
 * 
 * Following Senior QA Engineer standards with:
 * ✅ Comprehensive test coverage
 * ✅ Proper mocking strategies
 * ✅ Edge case validation
 * ✅ Error scenario testing
 * ✅ Response structure validation
 * 
 * =============================================================================
 */

// Mock the presence service
jest.mock('../../src/services/presence.service');

const mockPresenceService = presenceService as jest.Mocked<typeof presenceService>;

// Helper function to create authenticated request
const createAuthenticatedRequest = (
  query: any = {},
  body: any = {},
  userId: string = 'test-user-id'
): AuthenticatedRequest => {
  const req = {
    query,
    body,
    user: { id: userId },
  } as AuthenticatedRequest;
  return req;
};

// Helper function to create response mock
const createResponseMock = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;
  return res;
};

describe('Presence Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUsersController', () => {
    const mockServiceResponse = {
      users: [
        {
          id: 'user1',
          username: 'testuser1',
          firstName: 'Test',
          lastName: 'User1',
          avatar: 'avatar1.jpg',
          lastActive: new Date(),
          totalScore: 100,
          gamesPlayed: 10,
          gamesWon: 8,
          winRate: 80,
          currentStreak: 5,
          globalRank: 1,
        },
      ],
      pagination: {
        page: 1,
        limit: 50,
        total: 1,
        totalPages: 1,
      },
    };

    beforeEach(() => {
      mockPresenceService.getOnlineUsers.mockResolvedValue(mockServiceResponse);
      mockPresenceService.getOfflineUsers.mockResolvedValue(mockServiceResponse);
    });

    it('should get online users successfully with default parameters', async () => {
      const req = createAuthenticatedRequest({});
      const res = createResponseMock();

      await getUsersController(req, res);

      expect(mockPresenceService.getOnlineUsers).toHaveBeenCalledWith(1, 50, false);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Users retrieved successfully (showing online users)',
        data: {
          users: expect.arrayContaining([
            expect.objectContaining({
              status: 'online',
              isOnline: true,
            }),
          ]),
          pagination: mockServiceResponse.pagination,
          metadata: expect.objectContaining({
            statusFilter: 'online',
            includesStats: false,
            retrievedAt: expect.any(String),
          }),
        },
      });
    });

    it('should get online users with stats when requested', async () => {
      const req = createAuthenticatedRequest({
        status: 'online',
        page: '1',
        limit: '25',
        include: 'stats',
      });
      const res = createResponseMock();

      await getUsersController(req, res);

      expect(mockPresenceService.getOnlineUsers).toHaveBeenCalledWith(1, 25, true);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            metadata: expect.objectContaining({
              includesStats: true,
            }),
          }),
        })
      );
    });

    it('should get offline users when status is offline', async () => {
      const req = createAuthenticatedRequest({
        status: 'offline',
        page: '2',
        limit: '30',
        hours_back: '48',
      });
      const res = createResponseMock();

      await getUsersController(req, res);

      expect(mockPresenceService.getOfflineUsers).toHaveBeenCalledWith(2, 30, 48);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Offline users retrieved successfully',
        data: {
          users: expect.arrayContaining([
            expect.objectContaining({
              status: 'offline',
              isOnline: false,
            }),
          ]),
          pagination: mockServiceResponse.pagination,
          metadata: expect.objectContaining({
            statusFilter: 'offline',
            recentlyActiveWithin: '48 hours',
          }),
        },
      });
    });

    it('should handle invalid pagination parameters', async () => {
      const req = createAuthenticatedRequest({
        page: '-1',
        limit: '200', // Over max limit
      });
      const res = createResponseMock();

      await getUsersController(req, res);

      // Should use sanitized values (page: 1, limit: 100)
      expect(mockPresenceService.getOnlineUsers).toHaveBeenCalledWith(1, 100, false);
    });

    it('should handle invalid hours_back parameter', async () => {
      const req = createAuthenticatedRequest({
        status: 'offline',
        hours_back: '200', // Over max limit
      });
      const res = createResponseMock();

      await getUsersController(req, res);

      // Should use max allowed value (168 hours = 1 week)
      expect(mockPresenceService.getOfflineUsers).toHaveBeenCalledWith(1, 50, 168);
    });

    it('should handle invalid status parameter', async () => {
      const req = createAuthenticatedRequest({
        status: 'invalid',
      });
      const res = createResponseMock();

      await expect(getUsersController(req, res)).rejects.toThrow(ValidationError);
    });

    it('should handle service errors', async () => {
      mockPresenceService.getOnlineUsers.mockRejectedValue(new Error('Service error'));
      const req = createAuthenticatedRequest({});
      const res = createResponseMock();

      await expect(getUsersController(req, res)).rejects.toThrow('Service error');
    });
  });

  describe('getOnlineCountController', () => {
    const mockStats = {
      totalOnline: 150,
      totalRegistered: 1000,
      onlinePercentage: 15,
      lastUpdated: new Date(),
    };

    beforeEach(() => {
      mockPresenceService.getPresenceStats.mockResolvedValue(mockStats);
    });

    it('should get online count successfully', async () => {
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await getOnlineCountController(req, res);

      expect(mockPresenceService.getPresenceStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Online count retrieved successfully',
        data: {
          onlineCount: 150,
          totalRegistered: 1000,
          onlinePercentage: 15,
          lastUpdated: mockStats.lastUpdated,
        },
      });
    });

    it('should handle service errors', async () => {
      mockPresenceService.getPresenceStats.mockRejectedValue(new Error('Stats error'));
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await expect(getOnlineCountController(req, res)).rejects.toThrow('Stats error');
    });
  });

  describe('heartbeatController', () => {
    beforeEach(() => {
      mockPresenceService.updateHeartbeat.mockResolvedValue();
    });

    it('should update heartbeat successfully', async () => {
      const req = createAuthenticatedRequest({}, {
        device_info: { platform: 'mobile', version: '1.0' },
      });
      const res = createResponseMock();

      await heartbeatController(req, res);

      expect(mockPresenceService.updateHeartbeat).toHaveBeenCalledWith('test-user-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Heartbeat updated successfully',
        data: {
          userId: 'test-user-id',
          timestamp: expect.any(String),
        },
      });
    });

    it('should update heartbeat without device info', async () => {
      const req = createAuthenticatedRequest({}, {});
      const res = createResponseMock();

      await heartbeatController(req, res);

      expect(mockPresenceService.updateHeartbeat).toHaveBeenCalledWith('test-user-id');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle service errors', async () => {
      mockPresenceService.updateHeartbeat.mockRejectedValue(new Error('Heartbeat error'));
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await expect(heartbeatController(req, res)).rejects.toThrow('Heartbeat error');
    });
  });

  describe('getMyPresenceController', () => {
    const mockPresence = {
      userId: 'test-user-id',
      isOnline: true,
      lastSeen: new Date(),
      deviceInfo: { platform: 'mobile' },
    };

    beforeEach(() => {
      mockPresenceService.getUserPresence.mockResolvedValue(mockPresence);
    });

    it('should get user presence when data exists', async () => {
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await getMyPresenceController(req, res);

      expect(mockPresenceService.getUserPresence).toHaveBeenCalledWith('test-user-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User presence retrieved successfully',
        data: {
          presence: mockPresence,
          retrievedAt: expect.any(String),
        },
      });
    });

    it('should return default presence when no data exists', async () => {
      mockPresenceService.getUserPresence.mockResolvedValue(null);
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await getMyPresenceController(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User presence retrieved successfully',
        data: {
          presence: { isOnline: false, userId: 'test-user-id' },
          retrievedAt: expect.any(String),
        },
      });
    });

    it('should handle service errors', async () => {
      mockPresenceService.getUserPresence.mockRejectedValue(new Error('Presence error'));
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await expect(getMyPresenceController(req, res)).rejects.toThrow('Presence error');
    });
  });

  describe('getPresenceStatsController', () => {
    const mockStats = {
      totalOnline: 250,
      totalRegistered: 2000,
      onlinePercentage: 12.5,
      lastUpdated: new Date(),
    };

    beforeEach(() => {
      mockPresenceService.getPresenceStats.mockResolvedValue(mockStats);
    });

    it('should get presence statistics successfully', async () => {
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await getPresenceStatsController(req, res);

      expect(mockPresenceService.getPresenceStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Presence statistics retrieved successfully',
        data: {
          statistics: mockStats,
          retrievedAt: expect.any(String),
        },
      });
    });

    it('should handle service errors', async () => {
      mockPresenceService.getPresenceStats.mockRejectedValue(new Error('Stats error'));
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      await expect(getPresenceStatsController(req, res)).rejects.toThrow('Stats error');
    });
  });

  describe('searchUsersController', () => {
    const mockSearchResults = {
      users: [
        {
          id: 'search1',
          username: 'searchuser1',
          firstName: 'Search',
          lastName: 'User1',
          avatar: 'avatar1.jpg',
          lastActive: new Date(),
          status: 'online',
          isOnline: true,
          totalScore: 150,
          globalRank: 3,
        },
        {
          id: 'search2',
          username: 'searchuser2',
          firstName: 'Search',
          lastName: 'User2',
          avatar: null,
          lastActive: new Date(),
          status: 'offline',
          isOnline: false,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    };

    beforeEach(() => {
      mockPresenceService.searchUsersByUsername.mockResolvedValue(mockSearchResults);
    });

    it('should search users successfully with basic parameters', async () => {
      const req = createAuthenticatedRequest({
        query: 'search',
        page: '1',
        limit: '10',
      });
      const res = createResponseMock();

      await searchUsersController(req, res);

      expect(mockPresenceService.searchUsersByUsername).toHaveBeenCalledWith(
        'search',
        1,
        10,
        false
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Users found for query: \"search\"',
        data: {
          users: mockSearchResults.users,
          pagination: mockSearchResults.pagination,
          metadata: {
            retrievedAt: expect.any(String),
            searchQuery: 'search',
            includesStats: false,
          },
        },
      });
    });

    it('should search users with stats when requested', async () => {
      const req = createAuthenticatedRequest({
        query: 'searchterm',
        include: 'stats',
        limit: '20',
      });
      const res = createResponseMock();

      await searchUsersController(req, res);

      expect(mockPresenceService.searchUsersByUsername).toHaveBeenCalledWith(
        'searchterm',
        1,
        20,
        true
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            metadata: expect.objectContaining({
              includesStats: true,
            }),
          }),
        })
      );
    });

    it('should enforce maximum limit for search', async () => {
      const req = createAuthenticatedRequest({
        query: 'test',
        limit: '100', // Over search limit
      });
      const res = createResponseMock();

      await searchUsersController(req, res);

      // Should be limited to 50 for search
      expect(mockPresenceService.searchUsersByUsername).toHaveBeenCalledWith(
        'test',
        1,
        50,
        false
      );
    });

    it('should handle missing query parameter', async () => {
      const req = createAuthenticatedRequest({
        page: '1',
        limit: '10',
      });
      const res = createResponseMock();

      await expect(searchUsersController(req, res)).rejects.toThrow(ValidationError);
    });

    it('should handle empty query parameter', async () => {
      const req = createAuthenticatedRequest({
        query: '',
      });
      const res = createResponseMock();

      await expect(searchUsersController(req, res)).rejects.toThrow(ValidationError);
    });

    it('should handle query parameter too long', async () => {
      const req = createAuthenticatedRequest({
        query: 'a'.repeat(51), // Over 50 character limit
      });
      const res = createResponseMock();

      await expect(searchUsersController(req, res)).rejects.toThrow(ValidationError);
    });

    it('should handle service errors', async () => {
      mockPresenceService.searchUsersByUsername.mockRejectedValue(new Error('Search error'));
      const req = createAuthenticatedRequest({
        query: 'test',
      });
      const res = createResponseMock();

      await expect(searchUsersController(req, res)).rejects.toThrow('Search error');
    });

    it('should sanitize pagination parameters', async () => {
      const req = createAuthenticatedRequest({
        query: 'test',
        page: 'invalid',
        limit: 'invalid',
      });
      const res = createResponseMock();

      await searchUsersController(req, res);

      // Should use default values
      expect(mockPresenceService.searchUsersByUsername).toHaveBeenCalledWith(
        'test',
        1, // default page
        50, // default limit (but enforced to search max)
        false
      );
    });

    it('should handle special characters in search query', async () => {
      const specialQuery = 'user@domain.com';
      const req = createAuthenticatedRequest({
        query: specialQuery,
      });
      const res = createResponseMock();

      await searchUsersController(req, res);

      expect(mockPresenceService.searchUsersByUsername).toHaveBeenCalledWith(
        specialQuery,
        1,
        50,
        false
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle ValidationError with proper error formatting', async () => {
      const req = createAuthenticatedRequest({
        status: 'invalid-status',
      });
      const res = createResponseMock();

      await expect(getUsersController(req, res)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Invalid query parameters'),
        })
      );
    });

    it('should handle generic errors', async () => {
      mockPresenceService.getOnlineUsers.mockRejectedValue(new Error('Generic error'));
      const req = createAuthenticatedRequest({});
      const res = createResponseMock();

      await expect(getUsersController(req, res)).rejects.toThrow('Generic error');
    });
  });

  describe('Authentication Context', () => {
    it('should use authenticated user ID for heartbeat', async () => {
      mockPresenceService.updateHeartbeat.mockResolvedValue();
      const customUserId = 'custom-user-123';
      const req = createAuthenticatedRequest({}, {}, customUserId);
      const res = createResponseMock();

      await heartbeatController(req, res);

      expect(mockPresenceService.updateHeartbeat).toHaveBeenCalledWith(customUserId);
    });

    it('should use authenticated user ID for presence retrieval', async () => {
      mockPresenceService.getUserPresence.mockResolvedValue(null);
      const customUserId = 'custom-user-456';
      const req = createAuthenticatedRequest({}, {}, customUserId);
      const res = createResponseMock();

      await getMyPresenceController(req, res);

      expect(mockPresenceService.getUserPresence).toHaveBeenCalledWith(customUserId);
    });
  });

  describe('Response Formatting', () => {
    it('should include proper timestamp formatting', async () => {
      mockPresenceService.updateHeartbeat.mockResolvedValue();
      const req = createAuthenticatedRequest();
      const res = createResponseMock();

      const beforeCall = new Date().toISOString();
      await heartbeatController(req, res);
      const afterCall = new Date().toISOString();

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
          }),
        })
      );

      const response = (res.json as jest.Mock).mock.calls[0][0];
      const timestamp = response.data.timestamp;
      expect(timestamp).toBeGreaterThanOrEqual(beforeCall);
      expect(timestamp).toBeLessThanOrEqual(afterCall);
    });

    it('should include proper metadata in responses', async () => {
      mockPresenceService.getOnlineUsers.mockResolvedValue({
        users: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
      });
      
      const req = createAuthenticatedRequest({
        status: 'online',
        include: 'stats',
      });
      const res = createResponseMock();

      await getUsersController(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            metadata: expect.objectContaining({
              retrievedAt: expect.any(String),
              statusFilter: 'online',
              includesStats: true,
            }),
          }),
        })
      );
    });
  });
});
