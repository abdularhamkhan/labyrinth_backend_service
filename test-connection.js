const { PrismaClient } = require('./prisma/generated/prisma');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    
    // Try to create the User table if it doesn't exist
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" TEXT UNIQUE NOT NULL,
      "username" TEXT UNIQUE NOT NULL,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
    )`;
    
    console.log('User table created or already exists!');
    
    // Try to create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User'
      }
    });
    
    console.log('Test user created:', user);
    
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
