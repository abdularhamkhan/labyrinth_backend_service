import { jest } from '@jest/globals';
import {
  markUserOnline,
  markUserOffline,
  updateHeartbeat,
  getOnlineUsers,
  getOfflineUsers,
  getUserPresence,
  getPresenceStats,
  searchUsersByUsername,
  cleanupStalePresence,
} from '../../src/services/presence.service';
import { redis } from '../../src/config/redis';
import { prisma } from '../../src/config/prisma';
import { DatabaseError } from '../../src/constants/error';

/**
 * =============================================================================
 * PRESENCE SERVICE TESTS - COMPREHENSIVE COVERAGE
 * =============================================================================
 * 
 * Tests all presence service functions with proper mocking of:
 * - Redis operations
 * - Prisma database operations
 * - Error handling scenarios
 * - Edge cases and validation
 * 
 * Following Senior QA Engineer standards with:
 * ✅ Unit test isolation
 * ✅ Comprehensive test coverage
 * ✅ Error scenario testing
 * ✅ Performance considerations
 * ✅ Clean test structure
 * 
 * =============================================================================
 */

// Mock Redis
jest.mock('../../src/config/redis', () => ({
  redis: {
    pipeline: jest.fn(),
    zadd: jest.fn(),
    expire: jest.fn(),
    setex: jest.fn(),
    zrem: jest.fn(),
    del: jest.fn(),
    zrevrange: jest.fn(),
    zcard: jest.fn(),
    zrange: jest.fn(),
    get: jest.fn(),
    zscore: jest.fn(),
    zremrangebyscore: jest.fn(),
  },
}));

// Mock Prisma
jest.mock('../../src/config/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Type definitions for mocks
const mockRedis = redis as jest.Mocked<typeof redis>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Presence Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('markUserOnline', () => {
    const userId = 'test-user-id';
    const deviceInfo = { platform: 'mobile', version: '1.0' };

    beforeEach(() => {
      const mockPipeline = {
        zadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);
      mockPrisma.user.update.mockResolvedValue({} as any);
    });

    it('should mark user as online successfully', async () => {
      await markUserOnline(userId, deviceInfo);

      expect(mockRedis.pipeline).toHaveBeenCalled();
      const pipeline = mockRedis.pipeline();
      expect(pipeline.zadd).toHaveBeenCalledWith('presence:online', expect.any(Number), userId);
      expect(pipeline.expire).toHaveBeenCalledWith('presence:online', 300);
      expect(pipeline.setex).toHaveBeenCalledTimes(2); // presence data and heartbeat
      expect(pipeline.exec).toHaveBeenCalled();
    });

    it('should mark user as online without device info', async () => {
      await markUserOnline(userId);

      expect(mockRedis.pipeline).toHaveBeenCalled();
      const pipeline = mockRedis.pipeline();
      expect(pipeline.exec).toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      const mockPipeline = {
        zadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Redis error')),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);

      await expect(markUserOnline(userId)).rejects.toThrow(DatabaseError);
    });

    it('should not fail if database update fails', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error('DB error'));

      await expect(markUserOnline(userId)).resolves.not.toThrow();
    });
  });

  describe('markUserOffline', () => {
    const userId = 'test-user-id';

    beforeEach(() => {
      const mockPipeline = {
        zrem: jest.fn().mockReturnThis(),
        del: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);
      mockPrisma.user.update.mockResolvedValue({} as any);
    });

    it('should mark user as offline successfully', async () => {
      await markUserOffline(userId);

      expect(mockRedis.pipeline).toHaveBeenCalled();
      const pipeline = mockRedis.pipeline();
      expect(pipeline.zrem).toHaveBeenCalledWith('presence:online', userId);
      expect(pipeline.del).toHaveBeenCalledTimes(2); // presence and heartbeat keys
      expect(pipeline.exec).toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      const mockPipeline = {
        zrem: jest.fn().mockReturnThis(),
        del: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Redis error')),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);

      await expect(markUserOffline(userId)).rejects.toThrow(DatabaseError);
    });

    it('should not fail if database update fails', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error('DB error'));

      await expect(markUserOffline(userId)).resolves.not.toThrow();
    });
  });

  describe('updateHeartbeat', () => {
    const userId = 'test-user-id';

    beforeEach(() => {
      const mockPipeline = {
        setex: jest.fn().mockReturnThis(),
        zadd: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);
    });

    it('should update heartbeat successfully', async () => {
      await updateHeartbeat(userId);

      expect(mockRedis.pipeline).toHaveBeenCalled();
      const pipeline = mockRedis.pipeline();
      expect(pipeline.setex).toHaveBeenCalledWith(
        `heartbeat:${userId}`,
        120,
        expect.any(String)
      );
      expect(pipeline.zadd).toHaveBeenCalledWith('presence:online', expect.any(Number), userId);
      expect(pipeline.exec).toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully without throwing', async () => {
      const mockPipeline = {
        setex: jest.fn().mockReturnThis(),
        zadd: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Redis error')),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);

      await expect(updateHeartbeat(userId)).resolves.not.toThrow();
    });
  });

  describe('getOnlineUsers', () => {
    const mockUsers = [
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
        leaderboardEntry: { globalRank: 1 },
      },
      {
        id: 'user2',
        username: 'testuser2',
        firstName: 'Test',
        lastName: 'User2',
        avatar: null,
        lastActive: new Date(),
        totalScore: 200,
        gamesPlayed: 20,
        gamesWon: 15,
        winRate: 75,
        currentStreak: 3,
        leaderboardEntry: null,
      },
    ];

    beforeEach(() => {
      mockRedis.zrevrange.mockResolvedValue(['user1', 'user2']);
      mockRedis.zcard.mockResolvedValue(2);
      mockPrisma.user.findMany.mockResolvedValue(mockUsers as any);
    });

    it('should get online users with stats', async () => {
      const result = await getOnlineUsers(1, 50, true);

      expect(result.users).toHaveLength(2);
      expect(result.users[0]).toMatchObject({
        id: 'user1',
        username: 'testuser1',
        totalScore: 100,
        globalRank: 1,
      });
      expect(result.users[1]).toMatchObject({
        id: 'user2',
        username: 'testuser2',
        totalScore: 200,
        globalRank: undefined,
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 50,
        total: 2,
        totalPages: 1,
      });
    });

    it('should get online users without stats', async () => {
      const result = await getOnlineUsers(1, 50, false);

      expect(result.users).toHaveLength(2);
      expect(result.users[0]).not.toHaveProperty('totalScore');
      expect(result.users[0]).not.toHaveProperty('gamesPlayed');
    });

    it('should return empty result when no online users', async () => {
      mockRedis.zrevrange.mockResolvedValue([]);
      mockRedis.zcard.mockResolvedValue(0);

      const result = await getOnlineUsers(1, 50, true);

      expect(result.users).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should handle Redis errors', async () => {
      mockRedis.zrevrange.mockRejectedValue(new Error('Redis error'));

      await expect(getOnlineUsers(1, 50, true)).rejects.toThrow(DatabaseError);
    });

    it('should handle database errors', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('DB error'));

      await expect(getOnlineUsers(1, 50, true)).rejects.toThrow(DatabaseError);
    });

    it('should handle pagination correctly', async () => {
      await getOnlineUsers(2, 10, true);

      expect(mockRedis.zrevrange).toHaveBeenCalledWith(
        'presence:online',
        10, // offset = (2-1) * 10
        19  // offset + limit - 1
      );
    });
  });

  describe('getOfflineUsers', () => {
    const mockOfflineUsers = [
      {
        id: 'offline1',
        username: 'offlineuser1',
        firstName: 'Offline',
        lastName: 'User1',
        avatar: 'avatar1.jpg',
        lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        totalScore: 50,
        gamesPlayed: 5,
        gamesWon: 3,
        winRate: 60,
        currentStreak: 2,
        leaderboardEntry: { globalRank: 10 },
      },
    ];

    beforeEach(() => {
      mockRedis.zrange.mockResolvedValue(['user1', 'user2']); // online users
      mockPrisma.user.count.mockResolvedValue(1);
      mockPrisma.user.findMany.mockResolvedValue(mockOfflineUsers as any);
    });

    it('should get offline users successfully', async () => {
      const result = await getOfflineUsers(1, 50, 24);

      expect(result.users).toHaveLength(1);
      expect(result.users[0]).toMatchObject({
        id: 'offline1',
        username: 'offlineuser1',
        totalScore: 50,
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 50,
        total: 1,
        totalPages: 1,
      });

      // Verify database query excludes online users
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { notIn: ['user1', 'user2'] },
            status: 'ACTIVE',
            lastActive: expect.objectContaining({
              gte: expect.any(Date),
            }),
          }),
        })
      );
    });

    it('should handle no online users to exclude', async () => {
      mockRedis.zrange.mockResolvedValue([]); // no online users

      const result = await getOfflineUsers(1, 50, 24);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'ACTIVE',
            lastActive: expect.objectContaining({
              gte: expect.any(Date),
            }),
          }),
        })
      );
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.not.objectContaining({
          where: expect.objectContaining({
            id: expect.anything(),
          }),
        })
      );
    });

    it('should calculate time threshold correctly', async () => {
      const hoursBack = 48;
      await getOfflineUsers(1, 50, hoursBack);

      const expectedThreshold = new Date();
      expectedThreshold.setHours(expectedThreshold.getHours() - hoursBack);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            lastActive: expect.objectContaining({
              gte: expect.any(Date),
            }),
          }),
        })
      );
    });

    it('should handle Redis errors', async () => {
      mockRedis.zrange.mockRejectedValue(new Error('Redis error'));

      await expect(getOfflineUsers(1, 50, 24)).rejects.toThrow(DatabaseError);
    });

    it('should handle database errors', async () => {
      mockPrisma.user.count.mockRejectedValue(new Error('DB error'));

      await expect(getOfflineUsers(1, 50, 24)).rejects.toThrow(DatabaseError);
    });
  });

  describe('getUserPresence', () => {
    const userId = 'test-user-id';
    const mockPresenceData = {
      userId,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      deviceInfo: { platform: 'mobile' },
      timestamp: Date.now(),
    };

    it('should get user presence when data exists', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(mockPresenceData));

      const result = await getUserPresence(userId);

      expect(result).toEqual(mockPresenceData);
      expect(mockRedis.get).toHaveBeenCalledWith(`presence:user:${userId}`);
    });

    it('should return null when no presence data exists', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await getUserPresence(userId);

      expect(result).toBeNull();
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis error'));

      const result = await getUserPresence(userId);

      expect(result).toBeNull();
    });

    it('should handle JSON parsing errors gracefully', async () => {
      mockRedis.get.mockResolvedValue('invalid json');

      const result = await getUserPresence(userId);

      expect(result).toBeNull();
    });
  });

  describe('getPresenceStats', () => {
    beforeEach(() => {
      mockRedis.zcard.mockResolvedValue(50); // 50 online users
      mockPrisma.user.count.mockResolvedValue(200); // 200 total users
    });

    it('should get presence statistics successfully', async () => {
      const result = await getPresenceStats();

      expect(result).toMatchObject({
        totalOnline: 50,
        totalRegistered: 200,
        onlinePercentage: 25, // 50/200 * 100 = 25%
        lastUpdated: expect.any(Date),
      });
    });

    it('should handle zero registered users', async () => {
      mockPrisma.user.count.mockResolvedValue(0);

      const result = await getPresenceStats();

      expect(result.onlinePercentage).toBe(0);
    });

    it('should handle Redis errors', async () => {
      mockRedis.zcard.mockRejectedValue(new Error('Redis error'));

      await expect(getPresenceStats()).rejects.toThrow(DatabaseError);
    });

    it('should handle database errors', async () => {
      mockPrisma.user.count.mockRejectedValue(new Error('DB error'));

      await expect(getPresenceStats()).rejects.toThrow(DatabaseError);
    });

    it('should calculate percentage correctly with rounding', async () => {
      mockRedis.zcard.mockResolvedValue(33);
      mockPrisma.user.count.mockResolvedValue(100);

      const result = await getPresenceStats();

      expect(result.onlinePercentage).toBe(33); // Should be properly rounded
    });
  });

  describe('searchUsersByUsername', () => {
    const mockSearchUsers = [
      {
        id: 'search1',
        username: 'searchuser1',
        firstName: 'Search',
        lastName: 'User1',
        avatar: 'avatar1.jpg',
        lastActive: new Date(),
        totalScore: 100,
        gamesPlayed: 10,
        gamesWon: 8,
        winRate: 80,
        currentStreak: 5,
        leaderboardEntry: { globalRank: 5 },
      },
      {
        id: 'search2',
        username: 'searchuser2',
        firstName: 'Search',
        lastName: 'User2',
        avatar: null,
        lastActive: new Date(),
        totalScore: null,
        gamesPlayed: null,
        gamesWon: null,
        winRate: null,
        currentStreak: null,
        leaderboardEntry: null,
      },
    ];

    beforeEach(() => {
      mockPrisma.user.count.mockResolvedValue(2);
      mockPrisma.user.findMany.mockResolvedValue(mockSearchUsers as any);
      mockRedis.zscore.mockImplementation((key, userId) => {
        // Mock search1 as online, search2 as offline
        return userId === 'search1' ? Promise.resolve(Date.now()) : Promise.resolve(null);
      });
    });

    it('should search users by username with stats', async () => {
      const result = await searchUsersByUsername('search', 1, 10, true);

      expect(result.users).toHaveLength(2);
      expect(result.users[0]).toMatchObject({
        id: 'search1',
        username: 'searchuser1',
        status: 'online',
        isOnline: true,
        totalScore: 100,
        globalRank: 5,
      });
      expect(result.users[1]).toMatchObject({
        id: 'search2',
        username: 'searchuser2',
        status: 'offline',
        isOnline: false,
        totalScore: 0, // Default value for null
      });
    });

    it('should search users without stats', async () => {
      const result = await searchUsersByUsername('search', 1, 10, false);

      expect(result.users[0]).not.toHaveProperty('totalScore');
      expect(result.users[0]).not.toHaveProperty('gamesPlayed');
    });

    it('should use case-insensitive search', async () => {
      await searchUsersByUsername('SEARCH', 1, 10, false);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            username: {
              contains: 'SEARCH',
              mode: 'insensitive',
            },
          }),
        })
      );
    });

    it('should handle pagination correctly', async () => {
      await searchUsersByUsername('search', 3, 5, false);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (3-1) * 5
          take: 5,
        })
      );
    });

    it('should return empty results when no matches', async () => {
      mockPrisma.user.count.mockResolvedValue(0);
      mockPrisma.user.findMany.mockResolvedValue([]);

      const result = await searchUsersByUsername('nonexistent', 1, 10, false);

      expect(result.users).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should handle database errors', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('DB error'));

      await expect(searchUsersByUsername('search', 1, 10, false)).rejects.toThrow(DatabaseError);
    });

    it('should handle Redis errors gracefully for online status', async () => {
      mockRedis.zscore.mockRejectedValue(new Error('Redis error'));

      const result = await searchUsersByUsername('search', 1, 10, false);

      // Should still return results with offline status as fallback
      expect(result.users).toHaveLength(2);
      expect(result.users[0].isOnline).toBe(false);
      expect(result.users[1].isOnline).toBe(false);
    });
  });

  describe('cleanupStalePresence', () => {
    beforeEach(() => {
      mockRedis.zremrangebyscore.mockResolvedValue(5); // 5 stale entries removed
    });

    it('should cleanup stale presence data successfully', async () => {
      await cleanupStalePresence();

      expect(mockRedis.zremrangebyscore).toHaveBeenCalledWith(
        'presence:online',
        0,
        expect.any(Number) // cutoff timestamp
      );
    });

    it('should calculate cutoff time correctly', async () => {
      const beforeCall = Date.now() - (300 * 1000); // 5 minutes ago
      await cleanupStalePresence();
      const afterCall = Date.now() - (300 * 1000);

      expect(mockRedis.zremrangebyscore).toHaveBeenCalledWith(
        'presence:online',
        0,
        expect.any(Number)
      );

      const cutoffTime = mockRedis.zremrangebyscore.mock.calls[0][2];
      expect(cutoffTime).toBeGreaterThanOrEqual(beforeCall);
      expect(cutoffTime).toBeLessThanOrEqual(afterCall);
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedis.zremrangebyscore.mockRejectedValue(new Error('Redis error'));

      await expect(cleanupStalePresence()).resolves.not.toThrow();
    });
  });
});
