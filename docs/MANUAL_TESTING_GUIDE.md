# Manual Testing Guide - Labyrinth Backend

## Quick Setup

### 1. Get Your Auth Token
Login first:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"your-email@example.com","password":"your-password"}'
```

Copy the `token` from response: `"token": "eyJhbGc..."`

### 2. Set Token as Environment Variable
```bash
export AUTH_TOKEN="your-jwt-token-here"
```

---

## Core API Tests

### Authentication
```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "password": "StrongPass123!",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "dateOfBirth": "1998-05-15",
    "country": "Pakistan",
    "preferredLanguage": "English"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"test@example.com","password":"StrongPass123!"}'
```

### User Profile
```bash
# Get Profile
curl http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Update Profile
curl -X PUT http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Full-stack developer",
    "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
    "interests": ["AI", "Web Development"],
    "githubUrl": "https://github.com/username",
    "linkedinUrl": "https://linkedin.com/in/username"
  }'

# Get Demographics
curl http://localhost:3001/api/user/demographic \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Update Demographics
curl -X PUT http://localhost:3001/api/user/demographic \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateOfBirth": "1998-05-15",
    "country": "Pakistan",
    "preferredLanguage": "English"
  }'
```

### Matchmaking
```bash
# Get User Recommendations
curl "http://localhost:3001/api/matchmaking/recommendations?limit=10" \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Get Project Recommendations
curl "http://localhost:3001/api/matchmaking/recommendations/projects?limit=5" \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Swipe on User
curl -X POST http://localhost:3001/api/matchmaking/swipe \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "user-id-here",
    "direction": "RIGHT"
  }'

# Get Matches
curl http://localhost:3001/api/matchmaking/matches \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Get Swipe History
curl http://localhost:3001/api/matchmaking/swipes \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

### Chat
```bash
# Get All Chats
curl http://localhost:3001/api/chat/my-chats \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Create/Get Direct Chat
curl -X POST http://localhost:3001/api/chat/direct \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"participantId": "user-id-here"}'

# Send Message
curl -X POST http://localhost:3001/api/chat/CHAT_ID_HERE/message \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello! This is a test message",
    "type": "TEXT"
  }'

# Get Messages
curl "http://localhost:3001/api/chat/CHAT_ID_HERE/messages?page=1&limit=20" \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Typing Indicator
curl -X POST http://localhost:3001/api/chat/CHAT_ID_HERE/typing \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isTyping": true}'
```

### Projects
```bash
# Create Project
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Task Manager",
    "description": "Building an intelligent task management system",
    "requiredSkills": ["Python", "TensorFlow", "React"],
    "maxMembers": 5,
    "deadline": "2024-12-31T23:59:59Z",
    "isOpen": true
  }'

# Get Project Details
curl http://localhost:3001/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Update Project
curl -X PUT http://localhost:3001/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description",
    "isOpen": true
  }'

# Search Projects
curl "http://localhost:3001/api/projects/search?query=AI&limit=10" \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Get Project Activity
curl "http://localhost:3001/api/projects/PROJECT_ID_HERE/activity?limit=20" \
  -H "Authorization: Bearer $AUTH_TOKEN"

# Get Project Analytics
curl http://localhost:3001/api/projects/PROJECT_ID_HERE/analytics \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

### Pusher (Real-time)
```bash
# Get Pusher Auth for WebSocket
curl -X POST http://localhost:3001/api/pusher/auth \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "socket_id": "123456.789012",
    "channel_name": "private-chat-123"
  }'
```

---

## Running Automated Tests with Manual Token

### Option 1: Set Token in Environment
```bash
export MANUAL_AUTH_TOKEN="your-jwt-token"
npm test
```

### Option 2: Inline Token
```bash
MANUAL_AUTH_TOKEN="your-jwt-token" npm test tests/api
```

### Option 3: Run Specific Module
```bash
MANUAL_AUTH_TOKEN="your-jwt-token" npm test tests/api/matchmaking.test.ts
```

---

## Testing Checklist

### Authentication ✓
- [ ] Signup with demographics
- [ ] Login with email
- [ ] Login with username
- [ ] Forgot password (OTP email)
- [ ] Forgot username (email)

### User Profile ✓
- [ ] Get own profile
- [ ] Update profile (bio, skills, interests)
- [ ] Get demographics
- [ ] Update demographics

### Matchmaking ✓
- [ ] Get user recommendations
- [ ] Get project recommendations
- [ ] Swipe LEFT on user
- [ ] Swipe RIGHT on user
- [ ] Verify match creation (mutual right swipes)
- [ ] Get all matches
- [ ] Get swipe history

### Chat ✓
- [ ] Get all chats
- [ ] Create direct chat
- [ ] Send TEXT message
- [ ] Get messages with pagination
- [ ] Send typing indicator

### Projects ✓
- [ ] Create new project
- [ ] Get project details (verify Redis caching)
- [ ] Update project
- [ ] Search projects by keyword
- [ ] Get project activity feed
- [ ] Get project analytics

### Real-time (Pusher) ✓
- [ ] Get Pusher auth token
- [ ] Connect to private channel
- [ ] Receive typing indicators
- [ ] Receive new messages
- [ ] Receive match notifications

---

## API Response Format

All endpoints follow this structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400,
    "timestamp": "2024-12-05T12:00:00Z",
    "requestId": "req_123456"
  }
}
```

---

## Swagger UI

Access interactive API documentation:
- **Development**: http://localhost:3001/api-docs
- **Swagger JSON**: http://localhost:3001/swagger.json

Or use the new comprehensive swagger file:
```bash
# Serve swagger-complete.json
npx swagger-ui-watcher swagger-complete.json
```

---

## Demo Video Script (55 seconds)

"Our backend is built on **Node.js with TypeScript** for type safety, and **Express** for routing.

**Tech Stack:**
- **PostgreSQL via Supabase** - primary database with built-in auth
- **Prisma ORM** - type-safe queries
- **Redis** - caching for performance
- **Apache Kafka** - event-driven architecture
- **Pusher** - real-time WebSocket features
- **Amazon SES** - email delivery

**Core APIs:**
We have **30+ REST endpoints**:

**Authentication** - signup, login, OTP verification, password reset

**Matchmaking** - AI-powered recommendations, swipe mechanics, instant matches

**Chat** - real-time messaging with typing indicators

**Projects** - full CRUD, search, activity feeds, analytics

**User Profiles** - demographics, skills, Redis-cached

All endpoints are secured with JWT, rate-limited, and fully documented."

---

**Created**: December 5, 2024  
**API Version**: 2.0  
**Total Endpoints**: 30+  
**Status**: Production Ready
