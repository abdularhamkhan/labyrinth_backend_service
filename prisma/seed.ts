import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

/**
 * SEED SCRIPT - Database Only
 * 
 * Creates mock data for testing and demo purposes.
 * Users created here won't have Supabase Auth accounts.
 * For actual login, use your real test user.
 * 
 * These users will appear in:
 * - Recommendations API
 * - Search results
 * - Project collaborators
 * - Match suggestions
 */

// Sample data pools
const firstNames = ['Ahmed', 'Fatima', 'Ali', 'Sara', 'Hassan', 'Zainab', 'Usman', 'Ayesha', 'Omar', 'Maryam'];
const lastNames = ['Khan', 'Ahmed', 'Ali', 'Malik', 'Shah', 'Hussain', 'Raza', 'Iqbal', 'Siddiqui', 'Haider'];
const universities = ['FAST-NUCES', 'NUST', 'LUMS', 'GIKI', 'UET', 'COMSATS', 'IBA', 'NED', 'BNU', 'ITU'];
const techFrameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Express', 'NestJS', 'Django', 'Flask', 'Spring Boot'];
const techLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'Ruby', 'PHP'];
const techTools = ['Docker', 'Kubernetes', 'Git', 'Jenkins', 'AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL'];
const countries = ['Pakistan', 'India', 'Bangladesh', 'USA', 'UK', 'Canada', 'UAE', 'Saudi Arabia'];
const languages = ['English', 'Urdu', 'Punjabi', 'Hindi', 'Arabic', 'French', 'Spanish'];

// Project titles and descriptions
const projectTitles = [
  'E-commerce Platform',
  'Social Media App',
  'Task Management System',
  'Healthcare Portal',
  'Education Platform',
  'Food Delivery App',
  'Real Estate Portal',
  'Fitness Tracker',
  'Music Streaming App',
  'Travel Booking System'
];

const projectDescriptions = [
  'Building a modern e-commerce solution',
  'Creating the next social network',
  'Streamlining task management',
  'Improving healthcare accessibility',
  'Revolutionizing online education',
  'Making food delivery easier',
  'Simplifying property search',
  'Helping people stay fit',
  'Bringing music to everyone',
  'Making travel booking seamless'
];

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clean existing data (optional - be careful in production!)
  console.log('🗑️  Cleaning existing data...');
  // await prisma.message.deleteMany();
  // await prisma.chat.deleteMany();
  // await prisma.task.deleteMany();
  // await prisma.projectTechStack.deleteMany();
  // await prisma.userRole.deleteMany();
  // await prisma.role.deleteMany();
  // await prisma.match.deleteMany();
  // await prisma.swipe.deleteMany();
  // await prisma.friendRequest.deleteMany();
  // await prisma.preferences.deleteMany();
  // await prisma.project.deleteMany();
  // await prisma.workspace.deleteMany();
  // await prisma.demographic.deleteMany();
  // await prisma.techStack.deleteMany();
  // await prisma.user.deleteMany();
  // console.log('✅ Cleaned existing data\n');

  // 1. Create Tech Stacks (20)
  console.log('📚 Creating tech stacks...');
  const techStacks = [];
  for (let i = 0; i < 20; i++) {
    const techStack = await prisma.techStack.create({
      data: {
        frameworks: [
          techFrameworks[Math.floor(Math.random() * techFrameworks.length)],
          techFrameworks[Math.floor(Math.random() * techFrameworks.length)],
        ],
        languages: [
          techLanguages[Math.floor(Math.random() * techLanguages.length)],
          techLanguages[Math.floor(Math.random() * techLanguages.length)],
          techLanguages[Math.floor(Math.random() * techLanguages.length)],
        ],
        tools: [
          techTools[Math.floor(Math.random() * techTools.length)],
          techTools[Math.floor(Math.random() * techTools.length)],
        ],
      },
    });
    techStacks.push(techStack);
  }
  console.log(`✅ Created ${techStacks.length} tech stacks\n`);

  // 2. Create Demographics (20)
  console.log('🌍 Creating demographics...');
  const demographics = [];
  for (let i = 0; i < 20; i++) {
    const demographic = await prisma.demographic.create({
      data: {
        country: countries[Math.floor(Math.random() * countries.length)],
        languages: [
          languages[Math.floor(Math.random() * languages.length)],
          languages[Math.floor(Math.random() * languages.length)],
        ],
      },
    });
    demographics.push(demographic);
  }
  console.log(`✅ Created ${demographics.length} demographics\n`);

  // 3. Create Users (50)
  console.log('👥 Creating users...');
  const users = [];
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
    const email = `${username}@test.com`;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: 'dummy_hash_for_seed', // Not used since these are DB-only users
        firstName,
        lastName,
        dateOfBirth: new Date(1995 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        education: universities[Math.floor(Math.random() * universities.length)],
        gitHubProfile: `https://github.com/${username}`,
        techStackId: techStacks[Math.floor(Math.random() * techStacks.length)].id,
        demographicId: demographics[Math.floor(Math.random() * demographics.length)].id,
        status: 'ACTIVE',
        maxDailySwipes: 50,
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last week
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users\n`);

  // 4. Create Preferences (30)
  console.log('⚙️  Creating user preferences...');
  for (let i = 0; i < 30; i++) {
    await prisma.preferences.create({
      data: {
        userId: users[i].id,
        preferredTechStackId: techStacks[Math.floor(Math.random() * techStacks.length)].id,
        preferredDemographicId: demographics[Math.floor(Math.random() * demographics.length)].id,
      },
    });
  }
  console.log('✅ Created 30 user preferences\n');

  // 5. Create Workspaces (25) - One per user
  console.log('🏢 Creating workspaces...');
  const workspaces = [];
  for (let i = 0; i < Math.min(25, users.length); i++) {
    const workspace = await prisma.workspace.create({
      data: {
        name: `${users[i].username}'s Workspace`,
        description: 'A collaborative workspace',
        userId: users[i].id, // Use unique user for each workspace
      },
    });
    workspaces.push(workspace);
  }
  console.log(`✅ Created ${workspaces.length} workspaces\n`);

  // 6. Create Projects (30)
  console.log('📁 Creating projects...');
  const projects = [];
  for (let i = 0; i < 30; i++) {
    const owner = users[Math.floor(Math.random() * users.length)];
    const project = await prisma.project.create({
      data: {
        title: projectTitles[Math.floor(Math.random() * projectTitles.length)] + ` ${i}`,
        description: projectDescriptions[Math.floor(Math.random() * projectDescriptions.length)],
        workspaceId: workspaces[Math.floor(Math.random() * workspaces.length)].id,
        collaborators: {
          connect: [
            { id: owner.id },
            { id: users[Math.floor(Math.random() * users.length)].id },
          ],
        },
      },
    });
    projects.push(project);

    // Link tech stacks to project
    await prisma.projectTechStack.create({
      data: {
        projectId: project.id,
        techStackId: techStacks[Math.floor(Math.random() * techStacks.length)].id,
      },
    });
  }
  console.log(`✅ Created ${projects.length} projects\n`);

  // 7. Create Roles for Projects First
  console.log('👔 Creating roles...');
  const projectRoles = [];
  for (const project of projects) {
    const role = await prisma.role.create({
      data: {
        name: 'Member',
        roleName: 'MEMBER',
        projectId: project.id,
        permissions: ['READ', 'WRITE'],
      },
    });
    projectRoles.push(role);
  }
  console.log(`✅ Created ${projectRoles.length} roles\n`);

  // 8. Create Tasks (100)
  console.log('✅ Creating tasks...');
  const taskTitles = ['Setup Database', 'Design UI', 'Implement Auth', 'Write Tests', 'Deploy to Production'];
  for (let i = 0; i < 100; i++) {
    const role = projectRoles[Math.floor(Math.random() * projectRoles.length)];
    await prisma.task.create({
      data: {
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        taskName: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        description: 'This is a task description',
        status: ['PENDING', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)] as any,
        projectId: role.projectId,
        roleId: role.id,
        assignedToId: users[Math.floor(Math.random() * users.length)].id,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random within next month
      },
    });
  }
  console.log('✅ Created 100 tasks\n');

  // 9. Create Swipes (200)
  console.log('👈👉 Creating swipes...');
  for (let i = 0; i < 200; i++) {
    const swiper = users[Math.floor(Math.random() * users.length)];
    const swipee = users[Math.floor(Math.random() * users.length)];
    
    if (swiper.id !== swipee.id) {
      try {
        await prisma.swipe.create({
          data: {
            swiperId: swiper.id,
            swipeeUserId: swipee.id,
            isRightSwipe: Math.random() > 0.5,
          },
        });
      } catch (e) {
        // Skip duplicates
      }
    }
  }
  console.log('✅ Created ~200 swipes\n');

  // 10. Create Matches (50)
  console.log('💑 Creating matches...');
  let matchCount = 0;
  for (let i = 0; i < Math.min(50, users.length); i++) {
    const user = users[i];
    
    try {
      const match = await prisma.match.create({
        data: {
          userId: user.id,
          matchStatus: 'ACTIVE',
        },
      });
      
      // Add matched users (2-3 random users)
      const numMatches = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < numMatches; j++) {
        const matchedUser = users[Math.floor(Math.random() * users.length)];
        if (matchedUser.id !== user.id) {
          try {
            await prisma.matchUser.create({
              data: {
                matchId: match.id,
                userId: matchedUser.id,
              },
            });
          } catch (e) {
            // Skip duplicates
          }
        }
      }
      matchCount++;
    } catch (e) {
      // Skip if user already has a match
    }
  }
  console.log(`✅ Created ${matchCount} matches\n`);

  // 11. Create Chats (40)
  console.log('💬 Creating chats...');
  const chats = [];
  for (let i = 0; i < 40; i++) {
    const user1 = users[Math.floor(Math.random() * users.length)];
    const user2 = users[Math.floor(Math.random() * users.length)];
    
    if (user1.id !== user2.id) {
      try {
        const chat = await prisma.chat.create({
          data: {
            type: 'DIRECT',
          },
        });
        
        // Create chat participants
        await prisma.chatParticipant.createMany({
          data: [
            { chatId: chat.id, userId: user1.id },
            { chatId: chat.id, userId: user2.id },
          ],
        });
        
        chats.push(chat);
      } catch (e) {
        // Skip duplicates
      }
    }
  }
  console.log(`✅ Created ${chats.length} chats\n`);

  // 12. Create Messages (300)
  console.log('📨 Creating messages...');
  const messageContents = [
    'Hey! How are you?',
    'Would you like to collaborate on a project?',
    'I saw your profile, great skills!',
    'Let\'s connect and discuss ideas',
    'Thanks for accepting my request!',
  ];
  for (let i = 0; i < 300; i++) {
    if (chats.length > 0) {
      const chat = chats[Math.floor(Math.random() * chats.length)];
      await prisma.message.create({
        data: {
          content: messageContents[Math.floor(Math.random() * messageContents.length)],
          messageType: 'TEXT',
          chatId: chat.id,
          senderId: users[Math.floor(Math.random() * users.length)].id,
        },
      });
    }
  }
  console.log('✅ Created 300 messages\n');

  // 13. Create Friendships (80)
  console.log('👋 Creating friendships...');
  let friendshipCount = 0;
  for (let i = 0; i < 80; i++) {
    const requester = users[Math.floor(Math.random() * users.length)];
    const recipient = users[Math.floor(Math.random() * users.length)];
    
    if (requester.id !== recipient.id) {
      try {
        await prisma.friendship.create({
          data: {
            requesterId: requester.id,
            recipientId: recipient.id,
            status: ['PENDING', 'ACCEPTED', 'REJECTED'][Math.floor(Math.random() * 3)] as any,
            message: 'Let\'s connect!',
          },
        });
        friendshipCount++;
      } catch (e) {
        // Skip duplicates
      }
    }
  }
  console.log(`✅ Created ${friendshipCount} friendships\n`);

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${techStacks.length} tech stacks`);
  console.log(`   - ${demographics.length} demographics`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${workspaces.length} workspaces`);
  console.log(`   - ${projects.length} projects`);
  console.log(`   - ${chats.length} chats`);
  console.log(`   - ~200 swipes`);
  console.log(`   - ${matchCount} matches`);
  console.log(`   - 100 tasks`);
  console.log(`   - 300 messages`);
  console.log(`   - ${friendshipCount} friendships\n`);
  console.log('\n💡 Note: These are database-only users.');
  console.log('   For actual login, use your Supabase Auth test user.');
  console.log('   These users will appear in recommendations and search results.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
