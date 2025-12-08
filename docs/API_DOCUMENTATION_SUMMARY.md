# Labyrinth Backend API - Complete Documentation Summary

## Overview
- **Total Documented Endpoints**: 81/83
- **Version**: 3.0.0
- **Base URL (Dev)**: `http://localhost:3001/api`
- **Swagger UI**: `http://localhost:3001/api-docs`

## Module Breakdown

### 1. Authentication (8 endpoints)
All routes are public (no authentication required):
- `POST /api/auth/signup` - Register new user with OTP verification
- `POST /api/auth/verify-otp` - Verify email OTP and get JWT token
- `POST /api/auth/login` - Login with email/username and password
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/verify-otp-reset` - Verify OTP for password reset
- `POST /api/auth/reset-password` - Reset password with verification token
- `POST /api/auth/forgot-username` - Recover username via email
- `POST /api/auth/resend-otp` - Resend verification OTP

**Features**:
- Rate limiting on all endpoints
- OTP-based email verification
- 3-step password reset flow
- Secure token-based authentication

### 2. User Profile (15 endpoints)
All routes require authentication (`Authorization: Bearer {token}`):
- `GET /api/user/profile` - Get own profile
- `PUT /api/user/profile` - Update own profile
- `DELETE /api/user/account` - Delete account permanently
- `POST /api/user/avatar` - Upload avatar image
- `DELETE /api/user/avatar` - Remove avatar
- `GET /api/user/labyrinth-profile` - Get comprehensive profile
- `PUT /api/user/labyrinth-profile` - Update comprehensive profile
- `PUT /api/user/tech-stack` - Update tech stack (languages, frameworks, tools)
- `GET /api/user/demographic` - Get own demographics
- `PUT /api/user/demographic` - Update demographics (country, languages)
- `GET /api/user/:userId/demographics` - Get another user's demographics
- `PUT /api/user/preferences` - Update matchmaking preferences
- `GET /api/user/workspaces` - Get user workspaces and projects
- `GET /api/user/collaboration-stats` - Get collaboration statistics
- `GET /api/user/full-profile` - Get complete profile with all data

**Features**:
- Profile management with avatar support
- Tech stack tracking for matchmaking
- Demographics for global collaboration
- Collaboration statistics and analytics
- Redis caching for performance

### 3. Matchmaking (6 endpoints)
All routes require authentication:
- `GET /api/matchmaking/user-recommendations` - AI-powered user recommendations
- `GET /api/matchmaking/project-recommendations` - Project recommendations
- `POST /api/matchmaking/swipe` - Swipe left/right on users or projects
- `GET /api/matchmaking/matches` - Get mutual matches
- `GET /api/matchmaking/swipe-count` - Get daily swipe count and limit
- `GET /api/matchmaking/dashboard` - Comprehensive matchmaking dashboard

**Features**:
- AI-powered recommendations based on tech stack and demographics
- Tinder-style swipe mechanism
- Daily swipe limits
- Match system for mutual right swipes
- Redis caching for recommendations

### 4. Chat (11 endpoints)
All routes require authentication:
- `GET /api/chat` - Get all user chats
- `GET /api/chat/:chatId` - Get specific chat details
- `POST /api/chat/direct` - Create or get direct chat with another user
- `POST /api/chat/project` - Create project chat
- `GET /api/chat/unread-count` - Get total unread message count
- `POST /api/chat/pusher/auth` - Authenticate Pusher WebSocket channel
- `GET /api/chat/:chatId/messages` - Get chat messages (paginated)
- `POST /api/chat/:chatId/messages` - Send message in chat
- `DELETE /api/chat/messages/:messageId` - Delete message
- `POST /api/chat/:chatId/typing` - Set typing indicator
- `POST /api/chat/project/:projectId/add-user` - Add user to project chat

**Features**:
- Real-time messaging via Pusher WebSockets
- Direct and project chats
- Message types: TEXT, IMAGE, FILE
- Typing indicators
- Message deletion
- Pagination support

### 5. Projects (13 endpoints)
All routes require authentication:
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/search` - Search projects by keyword and tech stack
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project (owner only)
- `GET /api/projects/:projectId/dashboard` - Get project dashboard
- `GET /api/projects/:projectId/activity` - Get project activity feed
- `GET /api/projects/:projectId/analytics` - Get project analytics
- `POST /api/projects/:projectId/collaborators` - Add collaborator
- `DELETE /api/projects/:projectId/collaborators/:collaboratorId` - Remove collaborator
- `GET /api/projects/:projectId/tasks` - Get project tasks (with filters)
- `POST /api/projects/:projectId/tasks` - Create task
- `PUT /api/projects/tasks/:taskId` - Update task

**Features**:
- Project creation with workspace support
- Tech stack tracking
- Collaborator management
- Task management (PENDING, IN_PROGRESS, COMPLETED)
- Activity feed and analytics
- Full-text search

### 6. Friends (9 endpoints)
All routes require authentication:
- `POST /api/friends/request` - Send friend request
- `GET /api/friends/requests` - Get sent and received requests (paginated)
- `PUT /api/friends/:friendshipId` - Accept, decline, or remove friendship
- `GET /api/friends/list` - Get friends list (paginated)
- `PUT /api/friends/block/:targetUserId` - Block or unblock user
- `GET /api/friends/search` - Search users with friendship status
- `GET /api/friends/profile/:userId` - Get user profile with friendship status
- `GET /api/friends/stats` - Get friendship statistics
- `GET /api/friends/activity` - Get friend activity status

**Features**:
- Friend request system (PENDING, ACCEPTED, REJECTED)
- User blocking
- Friendship status context in search
- Friend activity tracking
- Comprehensive statistics

### 7. Media (13 endpoints)
All routes require authentication:
- `POST /api/media/init` - Initialize storage buckets (admin)
- `POST /api/media/avatar` - Upload user avatar (5MB max)
- `POST /api/media/project-image` - Upload project cover image (10MB max)
- `POST /api/media/chat` - Upload chat media (5 files, 20MB each)
- `POST /api/media/project-files` - Upload project files (10 files, 100MB each)
- `POST /api/media/workspace-banner` - Upload workspace banner (8MB max)
- `GET /api/media/stats` - Get media statistics
- `GET /api/media` - Get media list (with filters)
- `GET /api/media/:id` - Get specific media by ID
- `DELETE /api/media` - Delete multiple media files
- `POST /api/media/:id/signed-url` - Generate signed URL for secure access
- `POST /api/media/upload/single` - Generic single file upload (NOT_IMPLEMENTED)
- `POST /api/media/upload/multiple` - Generic multiple file upload (NOT_IMPLEMENTED)

**Features**:
- Category-based upload endpoints
- File type validation
- Size limits per category
- Supabase storage integration
- Signed URLs for secure access
- Media metadata and statistics
- Filtering by category, type, tags, date range

### 8. Presence (6 endpoints)
All routes require authentication:
- `GET /api/users` - Get users with online/offline status (paginated)
- `GET /api/users/online/count` - Get online user count (lightweight)
- `POST /api/users/heartbeat` - Send heartbeat (keep-alive every 2 min)
- `GET /api/users/me/presence` - Get own presence status
- `GET /api/users/presence/stats` - Get platform-wide presence statistics
- `GET /api/users/search` - Search users by username with presence

**Features**:
- Hybrid smart pagination (online/offline filtering)
- Redis + Database architecture
- Heartbeat mechanism for online status
- Rate limiting per endpoint type
- Real-time presence tracking

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {jwt-token}
```

Get token from:
- `POST /api/auth/login` - Returns token on successful login
- `POST /api/auth/verify-otp` - Returns token after email verification

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

## Rate Limiting

Different rate limits apply based on endpoint type:
- **Standard endpoints**: 60 requests/minute
- **Lightweight endpoints** (counts, stats): 120 requests/minute  
- **Analytics endpoints**: 30 requests/minute
- **Auth endpoints**: Custom limits (3-10 per hour/5min)

## Pagination

Endpoints supporting pagination use query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10-50 depending on endpoint)
- `offset` - Alternative to page (used in some endpoints)

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Cache**: Redis
- **Real-time**: Pusher WebSockets
- **Storage**: Supabase Storage
- **Email**: Amazon SES
- **Events**: Apache Kafka

## Files Generated

1. **swagger.json** - Complete OpenAPI 3.0.3 specification with all endpoints
2. **swagger-backup-25endpoints.json** - Backup of previous version
3. **API_DOCUMENTATION_SUMMARY.md** - This file

## Access Swagger UI

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:3001/api-docs`
3. Explore and test all 81 documented endpoints

## Notes

- Current documentation covers 81 of 83 total endpoints
- 2 endpoints may be undocumented or planned for future implementation
- All core functionality is fully documented and accessible via Swagger UI
- Rate limiting protects against abuse
- Redis caching improves performance
- Pusher provides real-time features

## Demo Script (55 seconds)

For FYP demo:
> "Labyrinth is a collaborative developer platform with 80+ REST APIs built on a modern tech stack. Node.js and TypeScript provide the runtime, Express handles routing, PostgreSQL via Supabase is our database, Prisma ORM for type-safe queries, Redis for caching frequently accessed data, Apache Kafka for event streaming, Pusher for real-time WebSocket messaging, and Amazon SES for email notifications. Our core APIs include Authentication with OTP verification, AI-powered Matchmaking that recommends collaborators using tech stack and demographics, Real-time Chat with Pusher, comprehensive Project Management with tasks and analytics, Friends and social networking, Media uploads to Supabase storage, and User Presence tracking. All endpoints are secured with JWT, rate-limited for protection, and fully documented in Swagger."
