"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cachingStrategies_1 = require("../../src/redis/strategies/cachingStrategies");
const redis_production_config_1 = require("../../src/redis/config/redis.production.config");
const prisma_1 = require("../../src/config/prisma");
// Mock Redis and Prisma
jest.mock('../../src/redis/config/redis.production.config', () => ({
    cacheRedis: {
        get: jest.fn(),
        setex: jest.fn(),
        del: jest.fn(),
        zadd: jest.fn(),
        expire: jest.fn(),
        zrevrange: jest.fn(),
        zrevrank: jest.fn(),
        pipeline: jest.fn(),
        exec: jest.fn(),
    },
}));
jest.mock('../../src/config/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        friendship: {
            findMany: jest.fn(),
        },
    },
}));
describe('Redis Caching Strategies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('CacheAsideStrategy', () => {
        describe('getUserProfile', () => {
            it('should return cached user profile when cache hit', async () => {
                const mockProfile = { id: '123', username: 'testuser', email: 'test@test.com' };
                redis_production_config_1.cacheRedis.get.mockResolvedValue(JSON.stringify(mockProfile));
                const result = await cachingStrategies_1.CacheAsideStrategy.getUserProfile('123');
                expect(redis_production_config_1.cacheRedis.get).toHaveBeenCalledWith('user:profile:123');
                expect(prisma_1.prisma.user.findUnique).not.toHaveBeenCalled();
                expect(result).toEqual(mockProfile);
            });
            it('should fetch from database and cache on cache miss', async () => {
                const mockProfile = { id: '123', username: 'testuser', email: 'test@test.com' };
                redis_production_config_1.cacheRedis.get.mockResolvedValue(null);
                prisma_1.prisma.user.findUnique.mockResolvedValue(mockProfile);
                const result = await cachingStrategies_1.CacheAsideStrategy.getUserProfile('123');
                expect(redis_production_config_1.cacheRedis.get).toHaveBeenCalledWith('user:profile:123');
                expect(prisma_1.prisma.user.findUnique).toHaveBeenCalledWith({
                    where: { id: '123' },
                    include: {
                        leaderboardEntry: true,
                        sessions: true,
                    },
                });
                expect(redis_production_config_1.cacheRedis.setex).toHaveBeenCalledWith('user:profile:123', 3600, JSON.stringify(mockProfile));
                expect(result).toEqual(mockProfile);
            });
        });
        describe('getFriendsList', () => {
            it('should return cached friends list when cache hit', async () => {
                const mockFriends = [{ id: '1', username: 'friend1' }];
                redis_production_config_1.cacheRedis.get.mockResolvedValue(JSON.stringify(mockFriends));
                const result = await cachingStrategies_1.CacheAsideStrategy.getFriendsList('123');
                expect(redis_production_config_1.cacheRedis.get).toHaveBeenCalledWith('user:friends:123');
                expect(prisma_1.prisma.friendship.findMany).not.toHaveBeenCalled();
                expect(result).toEqual(mockFriends);
            });
            it('should fetch from database and cache on cache miss', async () => {
                const mockFriends = [{ id: '1', username: 'friend1' }];
                redis_production_config_1.cacheRedis.get.mockResolvedValue(null);
                prisma_1.prisma.friendship.findMany.mockResolvedValue(mockFriends);
                const result = await cachingStrategies_1.CacheAsideStrategy.getFriendsList('123');
                expect(redis_production_config_1.cacheRedis.get).toHaveBeenCalledWith('user:friends:123');
                expect(prisma_1.prisma.friendship.findMany).toHaveBeenCalled();
                expect(redis_production_config_1.cacheRedis.setex).toHaveBeenCalledWith('user:friends:123', 1800, JSON.stringify(mockFriends));
                expect(result).toEqual(mockFriends);
            });
        });
    });
    describe('WriteThroughCache', () => {
        describe('updateUserStats', () => {
            it('should update database and cache simultaneously', async () => {
                const statsUpdate = { totalScore: 100, gamesPlayed: 1 };
                const updatedStats = { id: '123', username: 'test', ...statsUpdate };
                prisma_1.prisma.user.update.mockResolvedValue(updatedStats);
                const result = await cachingStrategies_1.WriteThroughCache.updateUserStats('123', statsUpdate);
                expect(prisma_1.prisma.user.update).toHaveBeenCalledWith({
                    where: { id: '123' },
                    data: statsUpdate,
                    select: {
                        id: true,
                        username: true,
                        totalScore: true,
                        gamesPlayed: true,
                        gamesWon: true,
                        winRate: true,
                        currentStreak: true,
                        bestStreak: true,
                    },
                });
                expect(redis_production_config_1.cacheRedis.setex).toHaveBeenCalledWith('user:stats:123', 1800, JSON.stringify(updatedStats));
                expect(result).toEqual(updatedStats);
            });
        });
    });
    describe('LeaderboardCache', () => {
        describe('updateLeaderboard', () => {
            it('should update leaderboard with sorted sets', async () => {
                await cachingStrategies_1.LeaderboardCache.updateLeaderboard('global', '123', 1000);
                expect(redis_production_config_1.cacheRedis.zadd).toHaveBeenCalledWith('leaderboard:global', 1000, '123');
                expect(redis_production_config_1.cacheRedis.expire).toHaveBeenCalledWith('leaderboard:global', 300);
            });
        });
        describe('getTopUsers', () => {
            it('should return top users from leaderboard', async () => {
                redis_production_config_1.cacheRedis.zrevrange.mockResolvedValue(['user1', '1000', 'user2', '900']);
                const result = await cachingStrategies_1.LeaderboardCache.getTopUsers('global', 2);
                expect(redis_production_config_1.cacheRedis.zrevrange).toHaveBeenCalledWith('leaderboard:global', 0, 1, 'WITHSCORES');
                expect(result).toEqual([
                    { userId: 'user1', score: 1000 },
                    { userId: 'user2', score: 900 },
                ]);
            });
        });
        describe('getUserRank', () => {
            it('should return user rank in leaderboard', async () => {
                redis_production_config_1.cacheRedis.zrevrank.mockResolvedValue(5);
                const result = await cachingStrategies_1.LeaderboardCache.getUserRank('global', '123');
                expect(redis_production_config_1.cacheRedis.zrevrank).toHaveBeenCalledWith('leaderboard:global', '123');
                expect(result).toBe(6); // 0-based to 1-based
            });
            it('should return null when user not found in leaderboard', async () => {
                redis_production_config_1.cacheRedis.zrevrank.mockResolvedValue(null);
                const result = await cachingStrategies_1.LeaderboardCache.getUserRank('global', '123');
                expect(result).toBeNull();
            });
        });
    });
});
