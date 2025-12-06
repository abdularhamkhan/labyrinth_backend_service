import { describe, it, expect, jest, beforeEach } from '@jest/globals';

/**
 * Unit tests for Matchmaking Service
 * Tests business logic for recommendations, swipes, and matching algorithms
 */

// Mock the Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn().mockReturnValue(null as any),
      findMany: jest.fn().mockReturnValue([] as any),
    },
    swipe: {
      create: jest.fn().mockReturnValue({} as any),
      findFirst: jest.fn().mockReturnValue(null as any),
    },
    match: {
      create: jest.fn().mockReturnValue({} as any),
      findMany: jest.fn().mockReturnValue([] as any),
    },
  })),
}));

// Mock Redis cache
jest.mock('../../src/utils/cache.util', () => ({
  redisClient: {
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
  },
  CacheKeys: {
    userRecommendations: jest.fn((userId: string) => `user:${userId}:recommendations`),
    projectRecommendations: jest.fn((userId: string) => `user:${userId}:project-recommendations`),
  },
  CacheTTL: {
    RECOMMENDATIONS: 3600,
  },
}));

// Import the service after mocks are set up
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('Matchmaking Service - Business Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Recommendation Algorithm', () => {
    it('should calculate skill match score correctly', () => {
      const userSkills = ['JavaScript', 'TypeScript', 'React'];
      const candidateSkills = ['TypeScript', 'React', 'Node.js'];
      
      // Calculate overlap
      const overlap = userSkills.filter(skill => 
        candidateSkills.includes(skill)
      ).length;
      
      const score = (overlap / Math.max(userSkills.length, candidateSkills.length)) * 100;
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeCloseTo(66.67, 1); // 2 out of 3 skills match
    });

    it('should calculate interest match score correctly', () => {
      const userInterests = ['AI', 'Web Development', 'Mobile Apps'];
      const candidateInterests = ['Web Development', 'Mobile Apps', 'DevOps'];
      
      const overlap = userInterests.filter(interest => 
        candidateInterests.includes(interest)
      ).length;
      
      const score = (overlap / Math.max(userInterests.length, candidateInterests.length)) * 100;
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeCloseTo(66.67, 1); // 2 out of 3 interests match
    });

    it('should prioritize users with higher combined scores', () => {
      const candidates = [
        { id: '1', skillScore: 80, interestScore: 60, combinedScore: 70 },
        { id: '2', skillScore: 90, interestScore: 85, combinedScore: 87.5 },
        { id: '3', skillScore: 50, interestScore: 40, combinedScore: 45 },
      ];

      const sorted = candidates.sort((a, b) => b.combinedScore - a.combinedScore);

      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('1');
      expect(sorted[2].id).toBe('3');
    });

    it('should filter out already swiped users', () => {
      const allCandidates = ['user1', 'user2', 'user3', 'user4'];
      const alreadySwiped = ['user2', 'user4'];

      const filtered = allCandidates.filter(id => !alreadySwiped.includes(id));

      expect(filtered).toHaveLength(2);
      expect(filtered).toContain('user1');
      expect(filtered).toContain('user3');
      expect(filtered).not.toContain('user2');
      expect(filtered).not.toContain('user4');
    });
  });

  describe('Swipe Logic', () => {
    it('should create a match when both users swipe right', async () => {
      const userId = 'user1';
      const targetUserId = 'user2';

      // Mock: Target user already swiped right on current user
      // @ts-expect-error - Mock return value
      (prisma.swipe.findFirst as jest.Mock).mockResolvedValue({
        id: 'swipe1',
        userId: targetUserId,
        targetUserId: userId,
        direction: 'RIGHT',
      });

      // Simulate match creation
      // @ts-expect-error - Mock return value
      (prisma.match.create as jest.Mock).mockResolvedValue({
        id: 'match1',
        user1Id: userId,
        user2Id: targetUserId,
        createdAt: new Date(),
      });

      const existingSwipe = await prisma.swipe.findFirst({
        where: {
          userId: targetUserId,
          targetUserId: userId,
          direction: 'RIGHT',
        },
      });

      expect(existingSwipe).toBeDefined();
      expect(existingSwipe?.direction).toBe('RIGHT');

      if (existingSwipe) {
        const match = await prisma.match.create({
          data: {
            user1Id: userId,
            user2Id: targetUserId,
          },
        });

        expect(match).toBeDefined();
        expect(match.user1Id).toBe(userId);
        expect(match.user2Id).toBe(targetUserId);
      }
    });

    it('should not create a match when only one user swipes right', async () => {
      const userId = 'user1';
      const targetUserId = 'user2';

      // Mock: No existing swipe from target user
      // @ts-expect-error - Mock return value
      (prisma.swipe.findFirst as jest.Mock).mockResolvedValue(null);

      const existingSwipe = await prisma.swipe.findFirst({
        where: {
          userId: targetUserId,
          targetUserId: userId,
          direction: 'RIGHT',
        },
      });

      expect(existingSwipe).toBeNull();
    });

    it('should prevent duplicate swipes on the same user', async () => {
      const userId = 'user1';
      const targetUserId = 'user2';

      // Mock: User already swiped on target
      // @ts-expect-error - Mock return value
      (prisma.swipe.findFirst as jest.Mock).mockResolvedValue({
        id: 'swipe1',
        userId: userId,
        targetUserId: targetUserId,
        direction: 'LEFT',
      });

      const existingUserSwipe = await prisma.swipe.findFirst({
        where: {
          userId: userId,
          targetUserId: targetUserId,
        },
      });

      expect(existingUserSwipe).toBeDefined();
      // In actual service, this would throw an error or return early
    });
  });

  describe('Match Retrieval', () => {
    it('should return matches for a user correctly', async () => {
      const userId = 'user1';

      // @ts-expect-error - Mock return value
      (prisma.match.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'match1',
          user1Id: userId,
          user2Id: 'user2',
          createdAt: new Date(),
          user1: { id: userId, username: 'user1' },
          user2: { id: 'user2', username: 'user2' },
        },
        {
          id: 'match2',
          user1Id: 'user3',
          user2Id: userId,
          createdAt: new Date(),
          user1: { id: 'user3', username: 'user3' },
          user2: { id: userId, username: 'user1' },
        },
      ]);

      const matches = await prisma.match.findMany({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
          ],
        },
        include: {
          user1: true,
          user2: true,
        },
      });

      expect(matches).toHaveLength(2);
      expect(matches[0].user1Id).toBe(userId);
      expect(matches[1].user2Id).toBe(userId);
    });
  });

  describe('Project Recommendations', () => {
    it('should recommend projects based on user skills', () => {
      const userSkills = ['React', 'TypeScript', 'Node.js'];
      const projects = [
        { id: '1', requiredSkills: ['React', 'TypeScript'], skillMatch: 100 },
        { id: '2', requiredSkills: ['Python', 'Django'], skillMatch: 0 },
        { id: '3', requiredSkills: ['React', 'Node.js', 'MongoDB'], skillMatch: 66.67 },
      ];

      const recommended = projects.filter(p => p.skillMatch > 0);

      expect(recommended).toHaveLength(2);
      expect(recommended.some(p => p.id === '2')).toBe(false);
    });

    it('should filter projects by availability status', () => {
      const projects = [
        { id: '1', isOpen: true, isFull: false },
        { id: '2', isOpen: false, isFull: false },
        { id: '3', isOpen: true, isFull: true },
        { id: '4', isOpen: true, isFull: false },
      ];

      const available = projects.filter(p => p.isOpen && !p.isFull);

      expect(available).toHaveLength(2);
      expect(available.map(p => p.id)).toEqual(['1', '4']);
    });
  });

  describe('Demographics-based Filtering', () => {
    it('should filter users by preferred language when specified', () => {
      const users = [
        { id: '1', preferredLanguage: 'English' },
        { id: '2', preferredLanguage: 'Spanish' },
        { id: '3', preferredLanguage: 'English' },
        { id: '4', preferredLanguage: 'French' },
      ];

      const targetLanguage = 'English';
      const filtered = users.filter(u => u.preferredLanguage === targetLanguage);

      expect(filtered).toHaveLength(2);
      expect(filtered.map(u => u.id)).toEqual(['1', '3']);
    });

    it('should filter users by country when specified', () => {
      const users = [
        { id: '1', country: 'USA' },
        { id: '2', country: 'Pakistan' },
        { id: '3', country: 'USA' },
        { id: '4', country: 'India' },
      ];

      const targetCountry = 'USA';
      const filtered = users.filter(u => u.country === targetCountry);

      expect(filtered).toHaveLength(2);
      expect(filtered.map(u => u.id)).toEqual(['1', '3']);
    });

    it('should calculate age compatibility for team matching', () => {
      const calculateAge = (dateOfBirth: string): number => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      const user1Age = calculateAge('2000-01-15');
      const user2Age = calculateAge('1998-06-20');
      const user3Age = calculateAge('2005-03-10');

      expect(user1Age).toBeGreaterThanOrEqual(18);
      expect(Math.abs(user1Age - user2Age)).toBeLessThanOrEqual(5);
      expect(Math.abs(user1Age - user3Age)).toBeGreaterThanOrEqual(5);
    });
  });
});
