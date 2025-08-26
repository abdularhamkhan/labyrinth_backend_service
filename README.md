<<<<<<< HEAD
# WaT-backend-code
Backend code for the the project With a Twist MVP. 
- Puzzle game
- Bible Verses 
- Daily Challenges
=======
# 🎮 WAT Backend - "With a Twist" Game API

A robust Node.js TypeScript backend for the WAT (With a Twist) gaming platform, featuring real-time gameplay, user management, leaderboards, and social features.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### Docker Development
```bash
# Run with docker-compose (production mode)
docker-compose up -d

# Run with development profile (hot reload)
docker-compose --profile development up -d

# Include Prisma Studio for database management
docker-compose --profile development --profile tools up -d
```

## 📁 Project Structure

```
wat-backend/
├── 🗂️ src/
│   ├── 🎮 controllers/     # Request handlers
│   ├── 🔧 services/        # Business logic
│   ├── 🗄️ models/          # Database models
│   ├── 🛣️ routes/          # API routes
│   ├── 🔒 middleware/      # Custom middleware
│   ├── ⚙️ utils/           # Utility functions
│   └── 📝 types/           # TypeScript types
├── 🏗️ prisma/             # Database schema & migrations
├── 🐳 docker/              # Docker configurations
├── 📊 scripts/             # Deployment & utility scripts
├── 🧪 tests/               # Test suites
└── 📚 docs/                # Documentation
```

## 🌟 Key Features

### 🎯 Core Gaming
- **Real-time Gameplay**: WebSocket-based multiplayer interactions
- **Leaderboards**: Global, weekly, and monthly rankings
- **Achievement System**: Unlockable achievements and rewards
- **Game Statistics**: Comprehensive player analytics

### 👥 Social Features
- **Friends System**: Add, remove, and manage friends
- **Online Presence**: Real-time online/offline status
- **Chat System**: In-game messaging capabilities
- **User Profiles**: Customizable player profiles

### 🔐 Authentication & Security
- **Supabase Integration**: Secure authentication system
- **JWT Tokens**: Stateless session management
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive request validation

### 📈 Performance & Scalability
- **Redis Caching**: High-performance data caching
- **Database Optimization**: Efficient queries with Prisma
- **Background Jobs**: Async task processing
- **Health Monitoring**: Built-in health checks

## 🛠️ Technology Stack

- **Runtime**: Node.js 22 LTS
- **Language**: TypeScript 5.x
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and caching
- **Authentication**: Supabase Auth
- **WebSockets**: Socket.io for real-time features
- **Testing**: Jest & Supertest
- **Deployment**: Docker + GitHub Actions CI/CD

## 🚀 Production Deployment

This project includes a complete CI/CD pipeline with automated deployments.

### Quick Setup
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Set up your deployment environment
./scripts/setup-deployment.sh production

# Deploy manually (optional)
./scripts/deploy.sh production
```

### GitHub Actions CI/CD
The pipeline automatically:
- ✅ Runs tests and quality checks
- 🐳 Builds optimized Docker images
- 🔒 Scans for security vulnerabilities
- 🚀 Deploys to staging/production
- 📊 Sends deployment notifications

**Deployment Triggers:**
- `main` branch → Staging environment
- `production` branch → Production environment  
- Manual triggers via GitHub Actions UI

### Server Requirements
- **Staging**: 2GB RAM, 20GB disk
- **Production**: 4GB RAM, 40GB disk
- **OS**: Ubuntu 20.04+ or similar
- **Dependencies**: Docker, Docker Compose, Nginx

## 📖 Documentation

- **[🚀 Deployment Guide](./DEPLOYMENT.md)** - Complete production setup
- **[🔧 API Documentation](./docs/api.md)** - Endpoint specifications
- **[🏗️ Database Schema](./docs/database.md)** - Data model overview
- **[🧪 Testing Guide](./docs/testing.md)** - Test coverage and practices

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Password update

### User Management  
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - List users (with filters)
- `GET /api/users/search` - Search users

### Friends System
- `GET /api/friends/list` - Get friends list (with online status & ranks)
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/accept` - Accept friend request
- `DELETE /api/friends/remove` - Remove friend

### Game Features
- `GET /api/leaderboard` - Global leaderboard
- `GET /api/achievements` - User achievements
- `POST /api/game/start` - Start game session
- `POST /api/game/end` - End game session

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

## 🔧 Configuration

### Environment Variables
```bash
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Cache & Sessions
REDIS_URL=redis://localhost:6379

# Authentication
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...

# External APIs
OPTIMIZE_API_KEY=...

# Frontend
FRONTEND_URL=https://...
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test:unit
npm run test:integration

# Run in watch mode (development)
npm run test:watch
```

## 📊 Monitoring & Health Checks

### Built-in Monitoring
- Health check endpoints
- Request logging and metrics
- Error tracking and alerting
- Performance monitoring

### Manual Health Check
```bash
# Check application health
curl http://localhost:3000/health

# Detailed system status
curl http://localhost:3000/health/detailed

# Container health (if using Docker)
./scripts/health-check.sh
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow
1. **Code Style**: Follow ESLint and Prettier configurations
2. **Testing**: Write tests for new features
3. **Type Safety**: Ensure full TypeScript coverage
4. **Documentation**: Update docs for API changes

## 🐛 Troubleshooting

### Common Issues

#### Server Won't Start
```bash
# Check for port conflicts
lsof -i :3000

# Check environment variables
npm run check:env

# View detailed logs
npm run dev -- --verbose
```

#### Database Connection Issues
```bash
# Test database connectivity
npm run prisma:status

# Reset database (development only)
npm run prisma:reset

# Apply pending migrations
npm run prisma:migrate
```

#### Docker Issues
```bash
# Rebuild containers
docker-compose up --build

# Check container logs
docker-compose logs -f

# Clean up containers
docker-compose down -v --remove-orphans
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/iMatrixGiggs/WaT-backend-code/issues)
- **Discussions**: [GitHub Discussions](https://github.com/iMatrixGiggs/WaT-backend-code/discussions)
- **Email**: [Contact Team](mailto:support@vcern.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using modern TypeScript and Node.js
- Powered by Supabase for authentication
- Deployed with Docker and GitHub Actions
- Monitored with built-in health checks

---

**🎉 Ready to deploy? Check out the [Deployment Guide](./DEPLOYMENT.md) for complete setup instructions!**
>>>>>>> fad1d68 (Initial commit: Production-ready WAT Backend with enterprise infrastructure)
