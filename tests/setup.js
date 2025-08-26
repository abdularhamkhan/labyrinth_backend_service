"use strict";
// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';
// Mock Prisma client
jest.mock('../src/config/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        },
        friendship: {
            findMany: jest.fn(),
        },
        // Add other models as needed
    },
}));
// Mock Supabase
jest.mock('../src/config/supabase', () => ({
    default: {
        auth: {
            signUp: jest.fn(),
            verifyOtp: jest.fn(),
            signInWithPassword: jest.fn(),
        },
    },
    supabase: {
        auth: {
            signUp: jest.fn(),
            verifyOtp: jest.fn(),
            signInWithPassword: jest.fn(),
        },
    },
}));
// Mock Redis config
jest.mock('../src/config/redis', () => ({
    default: {
        get: jest.fn(),
        setex: jest.fn(),
        del: jest.fn(),
        on: jest.fn(),
    },
}));
beforeAll(async () => {
    // Silence console logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
});
afterAll(async () => {
    // Clean up after tests
    jest.restoreAllMocks();
});
