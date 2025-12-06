import { describe, it, expect } from '@jest/globals';

/**
 * Unit tests for Validation and Utility Functions
 * Tests input validation, data sanitization, and helper utilities
 */

describe('Validation Utilities', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@company.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('Password Strength Validation', () => {
    const isStrongPassword = (password: string): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];
      
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    };

    it('should validate strong passwords', () => {
      const result = isStrongPassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords and provide error messages', () => {
      const result1 = isStrongPassword('weak');
      expect(result1.isValid).toBe(false);
      expect(result1.errors.length).toBeGreaterThan(0);

      const result2 = isStrongPassword('NoNumbers!');
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Password must contain at least one number');

      const result3 = isStrongPassword('nouppercasenum123!');
      expect(result3.isValid).toBe(false);
      expect(result3.errors).toContain('Password must contain at least one uppercase letter');
    });
  });

  describe('Username Validation', () => {
    const isValidUsername = (username: string): boolean => {
      // Username: 3-30 characters, alphanumeric and underscores only
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      return usernameRegex.test(username);
    };

    it('should validate correct usernames', () => {
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('Test_User_1')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false); // Too short
      expect(isValidUsername('a'.repeat(31))).toBe(false); // Too long
      expect(isValidUsername('user-name')).toBe(false); // Invalid character
      expect(isValidUsername('user@name')).toBe(false); // Invalid character
      expect(isValidUsername('user name')).toBe(false); // Space not allowed
    });
  });

  describe('URL Validation', () => {
    const isValidUrl = (url: string): boolean => {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      } catch {
        return false;
      }
    };

    it('should validate correct URLs', () => {
      expect(isValidUrl('https://github.com/user')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://linkedin.com/in/profile')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://invalid-protocol.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('should validate GitHub URLs specifically', () => {
      const isGitHubUrl = (url: string): boolean => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === 'github.com';
        } catch {
          return false;
        }
      };

      expect(isGitHubUrl('https://github.com/user/repo')).toBe(true);
      expect(isGitHubUrl('https://gitlab.com/user/repo')).toBe(false);
    });
  });

  describe('Date Validation', () => {
    const isValidDateOfBirth = (dateString: string): boolean => {
      const date = new Date(dateString);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      
      // Must be valid date and user must be at least 13 years old
      return !isNaN(date.getTime()) && age >= 13 && age <= 120;
    };

    it('should validate correct dates of birth', () => {
      expect(isValidDateOfBirth('2000-01-01')).toBe(true);
      expect(isValidDateOfBirth('1990-06-15')).toBe(true);
      expect(isValidDateOfBirth('1985-12-31')).toBe(true);
    });

    it('should reject invalid dates of birth', () => {
      expect(isValidDateOfBirth('2015-01-01')).toBe(false); // Too young
      expect(isValidDateOfBirth('1900-01-01')).toBe(false); // Too old
      expect(isValidDateOfBirth('invalid-date')).toBe(false); // Invalid format
    });

    it('should validate future deadlines', () => {
      const isValidDeadline = (dateString: string): boolean => {
        const deadline = new Date(dateString);
        const now = new Date();
        return !isNaN(deadline.getTime()) && deadline > now;
      };

      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const pastDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      expect(isValidDeadline(futureDate)).toBe(true);
      expect(isValidDeadline(pastDate)).toBe(false);
    });
  });

  describe('Array Validation', () => {
    const isValidSkillsArray = (skills: any): boolean => {
      return (
        Array.isArray(skills) &&
        skills.length > 0 &&
        skills.length <= 20 &&
        skills.every(skill => typeof skill === 'string' && skill.length > 0 && skill.length <= 50)
      );
    };

    it('should validate correct skills arrays', () => {
      expect(isValidSkillsArray(['JavaScript', 'TypeScript', 'React'])).toBe(true);
      expect(isValidSkillsArray(['Python'])).toBe(true);
    });

    it('should reject invalid skills arrays', () => {
      expect(isValidSkillsArray([])).toBe(false); // Empty array
      expect(isValidSkillsArray('not-an-array')).toBe(false); // Not an array
      expect(isValidSkillsArray([123, 456])).toBe(false); // Non-string elements
      expect(isValidSkillsArray([''])).toBe(false); // Empty string element
      expect(isValidSkillsArray(Array(25).fill('skill'))).toBe(false); // Too many items
    });
  });

  describe('Numeric Range Validation', () => {
    const isValidLimit = (limit: number): boolean => {
      return Number.isInteger(limit) && limit >= 1 && limit <= 100;
    };

    const isValidMaxMembers = (max: number): boolean => {
      return Number.isInteger(max) && max >= 2 && max <= 50;
    };

    it('should validate pagination limits', () => {
      expect(isValidLimit(10)).toBe(true);
      expect(isValidLimit(50)).toBe(true);
      expect(isValidLimit(1)).toBe(true);
      expect(isValidLimit(100)).toBe(true);
    });

    it('should reject invalid pagination limits', () => {
      expect(isValidLimit(0)).toBe(false);
      expect(isValidLimit(-5)).toBe(false);
      expect(isValidLimit(101)).toBe(false);
      expect(isValidLimit(10.5)).toBe(false); // Not an integer
    });

    it('should validate project max members', () => {
      expect(isValidMaxMembers(5)).toBe(true);
      expect(isValidMaxMembers(2)).toBe(true);
      expect(isValidMaxMembers(50)).toBe(true);
    });

    it('should reject invalid max members', () => {
      expect(isValidMaxMembers(1)).toBe(false); // Too few
      expect(isValidMaxMembers(51)).toBe(false); // Too many
      expect(isValidMaxMembers(0)).toBe(false);
    });
  });
});

describe('Data Sanitization Utilities', () => {
  describe('String Sanitization', () => {
    const sanitizeString = (input: string): string => {
      return input.trim().replace(/\s+/g, ' ');
    };

    it('should trim whitespace from strings', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('test   string')).toBe('test string');
    });

    it('should normalize multiple spaces', () => {
      expect(sanitizeString('too    many    spaces')).toBe('too many spaces');
    });
  });

  describe('HTML/Script Tag Prevention', () => {
    const stripHtmlTags = (input: string): string => {
      return input.replace(/<[^>]*>/g, '');
    };

    it('should remove HTML tags from input', () => {
      expect(stripHtmlTags('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(stripHtmlTags('<b>bold</b> text')).toBe('bold text');
      expect(stripHtmlTags('normal text')).toBe('normal text');
    });
  });

  describe('SQL Injection Prevention Patterns', () => {
    const hasSuspiciousPatterns = (input: string): boolean => {
      const suspiciousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/i,
        /(--|;|\/\*|\*\/)/,
        /(\bOR\b.*=.*)/i,
      ];
      return suspiciousPatterns.some(pattern => pattern.test(input));
    };

    it('should detect SQL injection attempts', () => {
      expect(hasSuspiciousPatterns("'; DROP TABLE users;--")).toBe(true);
      expect(hasSuspiciousPatterns("1 OR 1=1")).toBe(true);
      expect(hasSuspiciousPatterns("SELECT * FROM users")).toBe(true);
    });

    it('should allow safe input', () => {
      expect(hasSuspiciousPatterns('normal username')).toBe(false);
      expect(hasSuspiciousPatterns('test@example.com')).toBe(false);
    });
  });
});

describe('Helper Utilities', () => {
  describe('Pagination Helpers', () => {
    const calculatePagination = (page: number, limit: number, total: number) => {
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const skip = (page - 1) * limit;

      return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        skip,
      };
    };

    it('should calculate pagination correctly', () => {
      const result = calculatePagination(2, 10, 45);
      expect(result.totalPages).toBe(5);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.skip).toBe(10);
    });

    it('should handle first page correctly', () => {
      const result = calculatePagination(1, 10, 45);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.skip).toBe(0);
    });

    it('should handle last page correctly', () => {
      const result = calculatePagination(5, 10, 45);
      expect(result.hasNextPage).toBe(false);
      expect(result.totalPages).toBe(5);
    });
  });

  describe('Score Calculation', () => {
    const calculateMatchScore = (
      skillsOverlap: number,
      totalSkills: number,
      interestsOverlap: number,
      totalInterests: number
    ): number => {
      const skillWeight = 0.6;
      const interestWeight = 0.4;

      const skillScore = totalSkills > 0 ? (skillsOverlap / totalSkills) * 100 : 0;
      const interestScore = totalInterests > 0 ? (interestsOverlap / totalInterests) * 100 : 0;

      return (skillScore * skillWeight) + (interestScore * interestWeight);
    };

    it('should calculate weighted match scores', () => {
      // 3 out of 5 skills match, 2 out of 4 interests match
      const score = calculateMatchScore(3, 5, 2, 4);
      const expected = (60 * 0.6) + (50 * 0.4); // 36 + 20 = 56
      expect(score).toBeCloseTo(expected, 1);
    });

    it('should handle perfect matches', () => {
      const score = calculateMatchScore(5, 5, 4, 4);
      expect(score).toBe(100);
    });

    it('should handle no matches', () => {
      const score = calculateMatchScore(0, 5, 0, 4);
      expect(score).toBe(0);
    });
  });

  describe('Date Formatting', () => {
    const formatRelativeTime = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    it('should format recent times correctly', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');

      const fiveMinsAgo = new Date(now.getTime() - 5 * 60000);
      expect(formatRelativeTime(fiveMinsAgo)).toBe('5 minutes ago');

      const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });
  });

  describe('Array Deduplication', () => {
    const deduplicateArray = <T>(array: T[]): T[] => {
      return Array.from(new Set(array));
    };

    it('should remove duplicate values', () => {
      expect(deduplicateArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(deduplicateArray(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should preserve order of first occurrence', () => {
      expect(deduplicateArray([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });
  });
});
