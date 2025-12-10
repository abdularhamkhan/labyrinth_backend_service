# Labyrinth Backend API - Frontend Integration Guide
**Base URL (Production):** `https://labyrinth-backend-api-production.up.railway.app/api`  
**Swagger UI:** `https://labyrinth-backend-api-production.up.railway.app/api-docs`

**Total Endpoints:** 84 across 8 modules  
**Authentication:** JWT Bearer token (except Auth endpoints)  
**Real-time:** Pusher for chat, WebSocket for presence

---

## 🔑 Quick Start Authentication Flow

### 1. Sign Up → 2. Verify OTP → 3. Login → 4. Use Token

```javascript
// Step 1: Register
POST /auth/signup
{
  "userEmail": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe"
}
→ Response: 201 "User created, OTP sent"

// Step 2: Verify Email
POST /auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
→ Response: { token: "eyJhbG...", user: { id, username } }

// Step 3: Login (subsequent sessions)
POST /auth/login
{
  "emailOrUsername": "johndoe",
  "password": "SecurePass123!"
}
→ Response: { token: "eyJhbG...", user: { id, username } }

// Use token in all requests:
headers: { "Authorization": "Bearer eyJhbG..." }
```

---

## 📋 Module Overview

| Module | Endpoints | Purpose |
|--------|-----------|---------|
| **Authentication** | 8 | Signup, login, password reset, OTP verification |
| **User Profile** | 17 | Profile CRUD, tech stack, demographics, preferences |
| **Matchmaking** | 6 | AI recommendations, swipes, matches |
| **Chat** | 12 | Direct messages, project chats, real-time messaging |
| **Projects** | 13 | Project CRUD, collaborators, tasks, analytics |
| **Friends** | 9 | Friend requests, blocking, activity status |
| **Media** | 13 | File uploads (avatars, images, documents) |
| **Presence** | 6 | Online status, heartbeat, activity tracking |

---

## 🔐 1. AUTHENTICATION (8 endpoints)

### POST `/auth/signup` ✅ No Auth
**Purpose:** Create new account  
**Rate Limit:** 3/hour per IP

```json
{
  "userEmail": "user@example.com",
  "password": "Pass123!@#",  // Min 8 chars, uppercase, lowercase, number, special
  "username": "johndoe",     // Min 3 chars, unique
  "firstName": "John",
  "lastName": "Doe"
}
```
**Response 201:** `{ success: true, message: "OTP sent to email" }`  
**Response 409:** Email/username already exists

---

### POST `/auth/verify-otp` ✅ No Auth
**Purpose:** Verify email and get JWT token  
**Rate Limit:** 5/10min

```json
{
  "email": "user@example.com",
  "otp": "123456"  // 6-digit code from email
}
```
**Response 200:**
```json
{
  "success": true,
  "message": "Verification successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "uuid", "username": "johndoe" }
  }
}
```

---

### POST `/auth/login` ✅ No Auth
**Purpose:** Login with credentials  
**Rate Limit:** 10/5min

```json
{
  "emailOrUsername": "johndoe",  // Can be email OR username
  "password": "Pass123!@#"
}
```
**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "uuid", "username": "johndoe" }
  }
}
```
**Response 401:** Invalid credentials

---

### POST `/auth/forgot-password` ✅ No Auth
**Purpose:** Request password reset  
**Rate Limit:** 3/hour

```json
{ "email": "user@example.com" }
```
**Response 200:** OTP sent (even if email doesn't exist - security)

---

### POST `/auth/verify-otp-reset` ✅ No Auth
**Purpose:** Verify reset OTP, get verification token

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```
**Response 200:**
```json
{
  "message": "OTP verified",
  "verificationToken": "temp-token-xyz",
  "expiresIn": 600  // 10 minutes
}
```

---

### POST `/auth/reset-password` ✅ No Auth
**Purpose:** Set new password with verification token

```json
{
  "email": "user@example.com",
  "password": "NewPass123!@#",
  "verificationToken": "temp-token-xyz"
}
```
**Response 200:** Password reset successful

---

### POST `/auth/forgot-username` ✅ No Auth
**Purpose:** Send username to email

```json
{ "email": "user@example.com" }
```
**Response 200:** Username sent

---

### POST `/auth/resend-otp` ✅ No Auth
**Purpose:** Resend verification OTP

```json
{ "email": "user@example.com" }
```
**Response 200:** OTP resent

---

## 👤 2. USER PROFILE (17 endpoints)

### GET `/user/profile` 🔒 Auth Required
**Purpose:** Get own profile

**Response 200:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "totalScore": 150,
  "bio": "Full-stack developer"
}
```

---

### PUT `/user/profile` 🔒 Auth Required
**Purpose:** Update basic profile

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Senior developer passionate about AI"
}
```
**Response 200:** Profile updated

---

### DELETE `/user/account` 🔒 Auth Required
**Purpose:** Permanently delete account  
**Warning:** Irreversible - deletes all user data

**Response 200:** Account deleted

---

### POST `/user/avatar` 🔒 Auth Required
**Purpose:** Upload profile picture  
**Content-Type:** `multipart/form-data`

```
FormData:
  avatar: <File> (Max 5MB, JPG/PNG/WebP)
```
**Response 200:** `{ avatarUrl: "https://..." }`

---

### DELETE `/user/avatar` 🔒 Auth Required
**Purpose:** Remove profile picture

**Response 200:** Avatar removed

---

### GET `/user/labyrinth-profile` 🔒 Auth Required
**Purpose:** Get comprehensive profile (tech stack + demographics + stats)

**Response 200:**
```json
{
  "user": { "id", "username", "firstName", "lastName", "avatar", "bio" },
  "techStack": {
    "frameworks": ["React", "Node.js"],
    "languages": ["JavaScript", "Python"],
    "tools": ["Docker", "Git"]
  },
  "demographics": {
    "country": "USA",
    "languages": ["English", "Spanish"]
  },
  "stats": {
    "totalScore": 150,
    "projectCount": 5,
    "matchCount": 12
  }
}
```

---

### PUT `/user/labyrinth-profile` 🔒 Auth Required
**Purpose:** Update extended profile

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-15",  // YYYY-MM-DD format
  "gitHubProfile": "https://github.com/johndoe",
  "education": "BS Computer Science",
  "maxDailySwipes": 50  // Default 20, max 100
}
```
**Response 200:** Profile updated

---

### PUT `/user/tech-stack` 🔒 Auth Required
**Purpose:** Update technical skills

```json
{
  "frameworks": ["React", "Express", "Django"],
  "languages": ["JavaScript", "Python", "Go"],
  "tools": ["Docker", "Kubernetes", "Git"]
}
```
**Response 200:** Tech stack updated

---

### GET `/user/demographic` 🔒 Auth Required
**Purpose:** Get own demographics

**Response 200:**
```json
{
  "country": "USA",
  "languages": ["English", "Spanish"]
}
```

---

### PUT `/user/demographic` 🔒 Auth Required
**Purpose:** Update demographics

```json
{
  "country": "Canada",
  "languages": ["English", "French"]
}
```
**Response 200:** Demographics updated

---

### GET `/user/{userId}/demographics` 🔒 Auth Required
**Purpose:** View another user's demographics

**URL Params:** `userId` (UUID)

**Response 200:** Same structure as own demographics

---

### PUT `/user/preferences` 🔒 Auth Required
**Purpose:** Update matchmaking preferences

```json
{
  "preferredTechStackId": "uuid",
  "preferredDemographicId": "uuid"
}
```
**Response 200:** Preferences updated

---

### GET `/user/workspaces` 🔒 Auth Required
**Purpose:** Get user's workspaces and projects

**Response 200:**
```json
{
  "workspaces": [
    {
      "id": "uuid",
      "name": "Personal Projects",
      "projects": [
        { "id": "uuid", "title": "AI Chatbot", "role": "OWNER" }
      ]
    }
  ]
}
```

---

### GET `/user/collaboration-stats` 🔒 Auth Required
**Purpose:** Get collaboration metrics

**Response 200:**
```json
{
  "projectCount": 8,
  "activeCollaborations": 3,
  "totalContributions": 127,
  "completedTasks": 45
}
```

---

### GET `/user/full-profile` 🔒 Auth Required
**Purpose:** Get everything - profile, tech stack, demographics, workspaces, stats

**Response 200:** Combined data from all profile endpoints

---

## 🎯 3. MATCHMAKING (6 endpoints)

### GET `/matchmaking/user-recommendations` 🔒 Auth Required
**Purpose:** AI-powered user matches based on tech stack and preferences

**Query Params:** `limit` (default: 20)

**Response 200:**
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "username": "janedoe",
      "avatar": "https://...",
      "matchScore": 85,  // 0-100
      "techStack": ["React", "Python", "Docker"],
      "bio": "ML Engineer",
      "commonInterests": ["AI", "Web Development"]
    }
  ]
}
```

**When to use:** Swipe screen, find collaborators

---

### GET `/matchmaking/project-recommendations` 🔒 Auth Required
**Purpose:** Recommended projects to join

**Query Params:** `limit` (default: 10)

**Response 200:**
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "title": "AI Image Generator",
      "description": "...",
      "techStack": ["Python", "TensorFlow"],
      "matchScore": 92,
      "ownerId": "uuid",
      "ownerUsername": "alice"
    }
  ]
}
```

---

### POST `/matchmaking/swipe` 🔒 Auth Required
**Purpose:** Like/dislike user or project

```json
{
  "targetType": "user",  // or "project"
  "targetId": "uuid",
  "isRightSwipe": true   // true = like, false = dislike
}
```
**Response 200:**
```json
{
  "success": true,
  "isMatch": true,     // true if mutual right swipe
  "matchId": "uuid"    // present if isMatch = true
}
```

**When to use:** After showing recommendation, user swipes right/left

---

### GET `/matchmaking/matches` 🔒 Auth Required
**Purpose:** Get all mutual matches

**Response 200:**
```json
{
  "matches": [
    {
      "id": "uuid",
      "matchedUser": {
        "id": "uuid",
        "username": "janedoe",
        "avatar": "https://..."
      },
      "matchedAt": "2025-12-08T12:00:00Z",
      "matchScore": 85
    }
  ]
}
```

---

### GET `/matchmaking/swipe-count` 🔒 Auth Required
**Purpose:** Check daily swipe limit

**Response 200:**
```json
{
  "dailySwipeCount": 15,
  "maxDailySwipes": 50,
  "remainingSwipes": 35
}
```

**When to use:** Before showing recommendations, disable swipes if limit reached

---

### GET `/matchmaking/dashboard` 🔒 Auth Required
**Purpose:** Comprehensive matchmaking overview

**Response 200:**
```json
{
  "swipeStats": {
    "today": 15,
    "total": 234,
    "remaining": 35
  },
  "matches": { "total": 12, "new": 2 },
  "pendingRecommendations": 47
}
```

---

## 💬 4. CHAT (12 endpoints)

### GET `/chat` 🔒 Auth Required
**Purpose:** Get all user's chats (DM + project chats)

**Response 200:**
```json
{
  "chats": [
    {
      "id": "uuid",
      "type": "DIRECT",  // or "PROJECT"
      "participants": [
        { "id": "uuid", "username": "janedoe", "avatar": "https://..." }
      ],
      "lastMessage": {
        "content": "Hey!",
        "sentAt": "2025-12-08T12:00:00Z",
        "senderId": "uuid"
      },
      "unreadCount": 3
    }
  ]
}
```

**When to use:** Chat list screen

---

### GET `/chat/{chatId}` 🔒 Auth Required
**Purpose:** Get specific chat details

**URL Params:** `chatId` (UUID)

**Response 200:** Single chat object (same structure as GET /chat)

---

### POST `/chat/direct` 🔒 Auth Required
**Purpose:** Create or get existing DM chat

```json
{
  "targetUserId": "uuid"
}
```
**Response 200:**
```json
{
  "chat": {
    "id": "uuid",
    "type": "DIRECT",
    "participants": [...]
  },
  "isNew": false  // true if chat was just created
}
```

**When to use:** When user clicks "Message" on a profile

---

### POST `/chat/project` 🔒 Auth Required
**Purpose:** Create project chat (auto-adds all collaborators)

```json
{
  "projectId": "uuid"
}
```
**Response 200:** Chat object

**When to use:** When creating a new project

---

### GET `/chat/unread-count` 🔒 Auth Required
**Purpose:** Get total unread messages

**Response 200:**
```json
{ "unreadCount": 8 }
```

**When to use:** Show notification badge in navigation

---

### GET `/chat/dmmembers` 🔒 Auth Required
**Purpose:** Get all users you've chatted with (for search/filter)

**Query Params:** `search` (optional, filters by username/name)

**Response 200:**
```json
{
  "success": true,
  "message": "DM members retrieved successfully",
  "data": {
    "users": [
      {
        "id": "uuid",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "avatar": "https://...",
        "lastActive": "2025-12-08T12:00:00Z"
      }
    ],
    "count": 5
  }
}
```

**When to use:** Project member search, adding users to group

---

### POST `/chat/pusher/auth` 🔒 Auth Required
**Purpose:** Authenticate Pusher private channels

```json
{
  "socket_id": "123.456",
  "channel_name": "private-chat-uuid"
}
```
**Response 200:**
```json
{ "auth": "pusher-signature" }
```

**When to use:** Pusher client initialization (automatic)

---

### GET `/chat/{chatId}/messages` 🔒 Auth Required
**Purpose:** Get chat messages (paginated)

**URL Params:** `chatId` (UUID)  
**Query Params:**
- `page` (default: 1)
- `limit` (default: 50)

**Response 200:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "content": "Hello!",
      "messageType": "TEXT",  // or IMAGE, FILE
      "senderId": "uuid",
      "senderUsername": "janedoe",
      "sentAt": "2025-12-08T12:00:00Z",
      "mediaUrl": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234,
    "hasMore": true
  }
}
```

**When to use:** Opening a chat, load more (pagination)

---

### POST `/chat/{chatId}/messages` 🔒 Auth Required
**Purpose:** Send message (broadcasts via Pusher)

**URL Params:** `chatId` (UUID)

```json
{
  "content": "Hello, world!",
  "messageType": "TEXT",  // or IMAGE, FILE
  "mediaUrl": "https://..."  // if messageType = IMAGE/FILE
}
```
**Response 200:**
```json
{
  "message": {
    "id": "uuid",
    "content": "Hello, world!",
    "sentAt": "2025-12-08T12:00:00Z",
    "senderId": "uuid"
  }
}
```

**Real-time:** Other users receive via Pusher event `new-message` on channel `private-chat-{chatId}`

---

### DELETE `/chat/messages/{messageId}` 🔒 Auth Required
**Purpose:** Delete own message

**URL Params:** `messageId` (UUID)

**Response 200:** Message deleted

---

### POST `/chat/{chatId}/typing` 🔒 Auth Required
**Purpose:** Broadcast typing indicator

**URL Params:** `chatId` (UUID)

```json
{ "isTyping": true }  // false when stopped
```
**Response 200:** Typing indicator sent

**Real-time:** Other users receive via Pusher event `typing` on channel `private-chat-{chatId}`

**When to use:** On text input focus/blur

---

### POST `/chat/project/{projectId}/add-user` 🔒 Auth Required
**Purpose:** Add collaborator to project chat

**URL Params:** `projectId` (UUID)

```json
{ "userId": "uuid" }
```
**Response 200:** User added to chat

---

## 📁 5. PROJECTS (13 endpoints)

### GET `/projects` 🔒 Auth Required
**Purpose:** Get user's projects (owned + collaborating)

**Response 200:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "title": "AI Chatbot",
      "description": "...",
      "ownerId": "uuid",
      "role": "OWNER",  // or COLLABORATOR
      "techStack": ["Python", "TensorFlow"],
      "collaborators": [...]
    }
  ]
}
```

---

### POST `/projects` 🔒 Auth Required
**Purpose:** Create new project

```json
{
  "title": "AI Image Generator",
  "description": "Generate images using DALL-E API",
  "workspaceName": "Personal Projects",
  "workspaceDescription": "My personal workspace",
  "techStackIds": ["uuid", "uuid"]  // optional
}
```
**Response 201:**
```json
{
  "project": {
    "id": "uuid",
    "title": "AI Image Generator",
    "ownerId": "uuid"
  }
}
```

---

### GET `/projects/search` 🔒 Auth Required
**Purpose:** Search public projects

**Query Params:**
- `q` (required) - search keyword
- `techStacks` (optional) - comma-separated
- `limit` (default: 20)

**Response 200:** Array of projects matching search

**When to use:** Discover projects to join

---

### GET `/projects/{projectId}` 🔒 Auth Required
**Purpose:** Get project details

**URL Params:** `projectId` (UUID)

**Response 200:**
```json
{
  "id": "uuid",
  "title": "AI Chatbot",
  "description": "...",
  "owner": { "id": "uuid", "username": "johndoe" },
  "collaborators": [
    { "id": "uuid", "username": "janedoe", "role": "COLLABORATOR" }
  ],
  "techStack": ["Python", "FastAPI"],
  "createdAt": "2025-12-01T00:00:00Z"
}
```

---

### PUT `/projects/{projectId}` 🔒 Auth Required (Owner Only)
**Purpose:** Update project

**URL Params:** `projectId` (UUID)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "techStackIds": ["uuid", "uuid"]
}
```
**Response 200:** Project updated

---

### GET `/projects/{projectId}/dashboard` 🔒 Auth Required
**Purpose:** Project overview

**URL Params:** `projectId` (UUID)

**Response 200:**
```json
{
  "project": { "id", "title", "description" },
  "stats": {
    "memberCount": 5,
    "taskCount": 23,
    "completedTasks": 15
  },
  "recentActivity": [
    { "type": "TASK_COMPLETED", "userId": "uuid", "timestamp": "..." }
  ]
}
```

---

### GET `/projects/{projectId}/activity` 🔒 Auth Required
**Purpose:** Activity feed

**URL Params:** `projectId` (UUID)  
**Query Params:** `limit` (default: 20)

**Response 200:** Array of activity events

---

### GET `/projects/{projectId}/analytics` 🔒 Auth Required
**Purpose:** Project metrics

**URL Params:** `projectId` (UUID)

**Response 200:**
```json
{
  "memberCount": 5,
  "taskCount": 30,
  "completedTaskCount": 20,
  "completionRate": 66.67
}
```

---

### POST `/projects/{projectId}/collaborators` 🔒 Auth Required
**Purpose:** Add collaborator

**URL Params:** `projectId` (UUID)

```json
{
  "collaboratorId": "uuid",
  "permissions": ["READ", "WRITE"]  // optional
}
```
**Response 200:** Collaborator added

---

### DELETE `/projects/{projectId}/collaborators/{collaboratorId}` 🔒 Auth Required
**Purpose:** Remove collaborator

**URL Params:**
- `projectId` (UUID)
- `collaboratorId` (UUID)

**Response 200:** Collaborator removed

---

### GET `/projects/{projectId}/tasks` 🔒 Auth Required
**Purpose:** Get project tasks

**URL Params:** `projectId` (UUID)  
**Query Params:**
- `status` - PENDING, IN_PROGRESS, COMPLETED
- `assignedToId` (UUID)
- `page` (default: 1)
- `limit` (default: 20)

**Response 200:**
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Implement login",
      "description": "...",
      "status": "IN_PROGRESS",
      "assignedTo": { "id": "uuid", "username": "janedoe" },
      "dueDate": "2025-12-15T00:00:00Z"
    }
  ]
}
```

---

### POST `/projects/{projectId}/tasks` 🔒 Auth Required
**Purpose:** Create task

**URL Params:** `projectId` (UUID)

```json
{
  "title": "Build authentication",
  "description": "Implement JWT auth",
  "assignedToId": "uuid",  // optional
  "dueDate": "2025-12-15T00:00:00Z",  // optional
  "status": "PENDING"  // default
}
```
**Response 201:** Task created

---

### PUT `/projects/tasks/{taskId}` 🔒 Auth Required
**Purpose:** Update task

**URL Params:** `taskId` (UUID)

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "COMPLETED",
  "assignedToId": "uuid",
  "dueDate": "2025-12-20T00:00:00Z"
}
```
**Response 200:** Task updated

---

## 👥 6. FRIENDS (9 endpoints)

### POST `/friends/request` 🔒 Auth Required
**Purpose:** Send friend request

```json
{ "recipientId": "uuid" }
```
**Response 200:**
```json
{
  "success": true,
  "message": "Friend request sent",
  "data": {
    "friendshipId": "uuid",
    "status": "PENDING"
  }
}
```

---

### GET `/friends/requests` 🔒 Auth Required
**Purpose:** Get sent and received requests

**Query Params:**
- `limit` (default: 20)
- `offset` (default: 0)

**Response 200:**
```json
{
  "sent": [
    {
      "id": "uuid",
      "recipient": { "id": "uuid", "username": "janedoe" },
      "sentAt": "2025-12-08T12:00:00Z"
    }
  ],
  "received": [
    {
      "id": "uuid",
      "sender": { "id": "uuid", "username": "alice" },
      "sentAt": "2025-12-07T10:00:00Z"
    }
  ]
}
```

---

### PUT `/friends/{friendshipId}` 🔒 Auth Required
**Purpose:** Accept/decline/remove friendship

**URL Params:** `friendshipId` (UUID)

```json
{ "action": "accept" }  // or "decline", "remove"
```
**Response 200:** Friendship action completed

**When to use:**
- `accept` - Accept received request
- `decline` - Decline received request
- `remove` - Unfriend

---

### GET `/friends/list` 🔒 Auth Required
**Purpose:** Get accepted friends

**Query Params:**
- `limit` (default: 20)
- `offset` (default: 0)

**Response 200:**
```json
{
  "friends": [
    {
      "id": "uuid",
      "username": "janedoe",
      "avatar": "https://...",
      "isOnline": true,
      "friendsSince": "2025-01-15T00:00:00Z"
    }
  ]
}
```

---

### PUT `/friends/block/{targetUserId}` 🔒 Auth Required
**Purpose:** Block or unblock user

**URL Params:** `targetUserId` (UUID)

```json
{ "action": "block" }  // or "unblock"
```
**Response 200:** User blocked/unblocked

---

### GET `/friends/search` 🔒 Auth Required
**Purpose:** Search users with friendship status

**Query Params:**
- `query` (required) - search term
- `limit` (default: 10)
- `offset` (default: 0)

**Response 200:**
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "janedoe",
      "avatar": "https://...",
      "friendshipStatus": "NONE"  // PENDING_SENT, PENDING_RECEIVED, ACCEPTED, BLOCKED
    }
  ]
}
```

**When to use:** Add friend screen

---

### GET `/friends/profile/{userId}` 🔒 Auth Required
**Purpose:** View user profile with friendship context

**URL Params:** `userId` (UUID)

**Response 200:**
```json
{
  "user": { "id", "username", "avatar", "bio" },
  "friendshipStatus": "ACCEPTED",
  "mutualFriends": 5,
  "commonProjects": 2
}
```

---

### GET `/friends/stats` 🔒 Auth Required
**Purpose:** Friendship statistics

**Response 200:**
```json
{
  "totalFriends": 24,
  "pendingSent": 3,
  "pendingReceived": 2,
  "blockedUsers": 1
}
```

---

### GET `/friends/activity` 🔒 Auth Required
**Purpose:** Friends' online status and activities

**Query Params:** `friendIds` (optional, comma-separated)

**Response 200:**
```json
{
  "friends": [
    {
      "id": "uuid",
      "username": "janedoe",
      "isOnline": true,
      "lastActive": "2025-12-08T12:00:00Z",
      "currentActivity": "Working on AI Project"
    }
  ]
}
```

---

## 📤 7. MEDIA (13 endpoints)

### POST `/media/init` 🔒 Auth Required (Admin)
**Purpose:** Initialize storage buckets

**Response 200:** Storage initialized

---

### POST `/media/avatar` 🔒 Auth Required
**Purpose:** Upload avatar  
**Content-Type:** `multipart/form-data`

```
FormData:
  avatar: <File> (Max 5MB, JPG/PNG/WebP)
```
**Response 200:**
```json
{
  "media": {
    "id": "uuid",
    "url": "https://...",
    "category": "AVATAR"
  }
}
```

---

### POST `/media/project-image` 🔒 Auth Required
**Purpose:** Upload project cover  
**Content-Type:** `multipart/form-data`

```
FormData:
  projectId: "uuid"
  file: <File> (Max 10MB, JPG/PNG/WebP/GIF)
```
**Response 200:** Media object

---

### POST `/media/chat` 🔒 Auth Required
**Purpose:** Upload chat media (multiple files)  
**Content-Type:** `multipart/form-data`

```
FormData:
  chatId: "uuid"
  files: [<File>, <File>] (Max 5 files, 20MB each)
```
**Response 200:**
```json
{
  "uploadedFiles": [
    { "id": "uuid", "url": "https://..." }
  ]
}
```

---

### POST `/media/project-files` 🔒 Auth Required
**Purpose:** Upload project documents  
**Content-Type:** `multipart/form-data`

```
FormData:
  files: [<File>] (Max 10 files, 100MB each)
```
**Response 200:** Array of uploaded files

---

### POST `/media/workspace-banner` 🔒 Auth Required
**Purpose:** Upload workspace banner  
**Content-Type:** `multipart/form-data`

```
FormData:
  banner: <File> (Max 8MB, min 800x300)
```
**Response 200:** Media object

---

### GET `/media/stats` 🔒 Auth Required
**Purpose:** Media statistics

**Response 200:**
```json
{
  "totalFiles": 234,
  "storageUsed": 1024000000,  // bytes
  "byCategory": {
    "AVATAR": 10,
    "PROJECT": 50,
    "CHAT": 174
  }
}
```

---

### GET `/media` 🔒 Auth Required
**Purpose:** List user's media files

**Query Params:**
- `category` - AVATAR, PROJECT, CHAT, etc.
- `type` - image, video, document
- `tags` - comma-separated
- `limit` (default: 20)
- `offset` (default: 0)

**Response 200:** Paginated media list

---

### DELETE `/media` 🔒 Auth Required
**Purpose:** Delete multiple files

```json
{
  "mediaIds": ["uuid", "uuid"],
  "deleteFromStorage": true  // default true
}
```
**Response 200:** Files deleted

---

### GET `/media/{id}` 🔒 Auth Required
**Purpose:** Get file metadata

**URL Params:** `id` (UUID)

**Response 200:**
```json
{
  "id": "uuid",
  "url": "https://...",
  "category": "CHAT",
  "type": "image",
  "size": 1024000,
  "uploadedAt": "2025-12-08T12:00:00Z"
}
```

---

### POST `/media/{id}/signed-url` 🔒 Auth Required
**Purpose:** Generate temporary signed URL

**URL Params:** `id` (UUID)

```json
{ "expiresIn": 3600 }  // seconds, default 3600
```
**Response 200:**
```json
{
  "signedUrl": "https://...",
  "expiresAt": "2025-12-08T13:00:00Z"
}
```

**When to use:** Secure file access, prevent hotlinking

---

### POST `/media/upload/single` 🔒 Auth Required
**Purpose:** Generic single file upload

**Response 501:** Not implemented (use specific endpoints)

---

### POST `/media/upload/multiple` 🔒 Auth Required
**Purpose:** Generic multiple file upload

**Response 501:** Not implemented (use specific endpoints)

---

## 🟢 8. PRESENCE (6 endpoints)

### GET `/users` 🔒 Auth Required
**Purpose:** Get users with online status

**Query Params:**
- `status` - online, offline (default: online)
- `page` (default: 1)
- `limit` (default: 50)
- `include` - stats (optional)

**Response 200:**
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "janedoe",
      "isOnline": true,
      "lastActive": "2025-12-08T12:00:00Z"
    }
  ]
}
```

---

### GET `/users/online/count` 🔒 Auth Required
**Purpose:** Quick online count  
**Rate Limit:** 120/min

**Response 200:**
```json
{ "onlineCount": 47 }
```

**When to use:** Dashboard, real-time stats

---

### POST `/users/heartbeat` 🔒 Auth Required
**Purpose:** Keep-alive (maintain online status)

```json
{
  "device_info": {  // optional
    "platform": "web",
    "version": "1.0.0"
  }
}
```
**Response 200:** Heartbeat recorded

**When to use:** Call every 2 minutes while app is active

---

### GET `/users/me/presence` 🔒 Auth Required
**Purpose:** Get own presence status  
**Rate Limit:** 120/min

**Response 200:**
```json
{
  "isOnline": true,
  "lastActive": "2025-12-08T12:00:00Z",
  "lastHeartbeat": "2025-12-08T11:58:00Z"
}
```

---

### GET `/users/presence/stats` 🔒 Auth Required (Admin)
**Purpose:** Platform-wide analytics  
**Rate Limit:** 30/min

**Response 200:**
```json
{
  "onlineNow": 47,
  "activeToday": 234,
  "averageSessionDuration": 1800  // seconds
}
```

---

### GET `/users/search` 🔒 Auth Required
**Purpose:** Search by username with presence

**Query Params:**
- `query` (required, 1-50 chars)
- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `include` - stats (optional)

**Response 200:** Users array with presence status

---

## 🔄 Common Workflows

### 1. **User Onboarding**
```
1. POST /auth/signup
2. POST /auth/verify-otp
3. PUT /user/labyrinth-profile (set demographics)
4. PUT /user/tech-stack (add skills)
5. POST /media/avatar (upload picture)
```

### 2. **Finding Collaborators**
```
1. GET /matchmaking/user-recommendations
2. Display users in swipe UI
3. POST /matchmaking/swipe (isRightSwipe: true)
4. If isMatch: true → navigate to chat
5. POST /chat/direct (targetUserId)
6. POST /chat/{chatId}/messages
```

### 3. **Creating Project**
```
1. POST /projects (create)
2. POST /media/project-image (upload cover)
3. POST /projects/{projectId}/collaborators (add team)
4. POST /chat/project (create group chat)
5. POST /projects/{projectId}/tasks (add tasks)
```

### 4. **Chat Conversation**
```
1. GET /chat (list chats)
2. GET /chat/{chatId}/messages (load history)
3. Initialize Pusher:
   - POST /chat/pusher/auth
   - Subscribe to private-chat-{chatId}
   - Listen for "new-message" events
4. POST /chat/{chatId}/messages (send)
5. POST /chat/{chatId}/typing (typing indicator)
```

### 5. **Friend System**
```
1. GET /friends/search?query=john
2. POST /friends/request (recipientId)
3. Other user: GET /friends/requests
4. Other user: PUT /friends/{friendshipId} (action: accept)
5. Both users: GET /friends/list
```

### 6. **Project Management**
```
1. GET /projects (dashboard)
2. GET /projects/{projectId}/dashboard
3. GET /projects/{projectId}/tasks?status=PENDING
4. PUT /projects/tasks/{taskId} (status: IN_PROGRESS)
5. GET /projects/{projectId}/analytics
```

### 7. **Maintaining Online Presence**
```
1. On app launch: POST /users/heartbeat
2. Every 2 minutes: POST /users/heartbeat
3. Display friends: GET /friends/activity
4. Show online count: GET /users/online/count
```

---

## 🚨 Error Handling

All endpoints return consistent error structure:

```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "status": 404
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🔐 Authentication Headers

**All authenticated endpoints require:**
```javascript
headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**For file uploads:**
```javascript
headers: {
  "Authorization": "Bearer eyJhbGciOi...",
  "Content-Type": "multipart/form-data"
}
```

---

## 📡 Real-time (Pusher)

### Chat Events
```javascript
// Initialize
const pusher = new Pusher('deb2b82031a08a5efae6', {
  cluster: 'ap2',
  authEndpoint: '/api/chat/pusher/auth',
  auth: { headers: { Authorization: 'Bearer ...' } }
});

// Subscribe to chat
const channel = pusher.subscribe(`private-chat-${chatId}`);

// Listen for messages
channel.bind('new-message', (data) => {
  console.log('New message:', data);
  // data: { id, content, senderId, senderUsername, sentAt }
});

// Listen for typing
channel.bind('typing', (data) => {
  console.log('User typing:', data);
  // data: { userId, username, isTyping }
});
```

---

## 🎯 Best Practices

1. **Token Storage:** Store JWT in secure storage (not localStorage on web - use httpOnly cookies or sessionStorage)
2. **Heartbeat:** Implement background interval for `/users/heartbeat` (2-minute intervals)
3. **Pagination:** Always respect `limit` and `offset` parameters for large lists
4. **File Uploads:** Show progress bar, validate size/type on frontend before upload
5. **Error Messages:** Display user-friendly messages, log technical errors
6. **Rate Limits:** Show "Too many requests" with countdown timer
7. **Offline Mode:** Cache essential data, queue requests, sync on reconnect
8. **Real-time:** Always initialize Pusher after successful login
9. **Image Optimization:** Compress images before upload (use canvas API)
10. **Search Debouncing:** Debounce search inputs (300ms) to reduce API calls

---

## 📊 Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/signup | 3 | 1 hour |
| POST /auth/verify-otp | 5 | 10 min |
| POST /auth/login | 10 | 5 min |
| POST /auth/forgot-password | 3 | 1 hour |
| POST /auth/resend-otp | 3 | 1 hour |
| GET /users/online/count | 120 | 1 min |
| GET /users/me/presence | 120 | 1 min |
| GET /users/presence/stats | 30 | 1 min |

---

## 🛠️ Testing Tips

1. **Use Swagger UI:** https://labyrinth-backend-api-production.up.railway.app/api-docs
2. **Test Auth Flow First:** Get JWT token before testing other endpoints
3. **Create Test Data:** Create 2-3 test users to test matchmaking/chat
4. **Test Real-time:** Open 2 browser tabs to test Pusher events
5. **Check Console:** Monitor network tab for request/response structure

---

## 📝 Quick Reference Card

```
🔑 Auth:      /auth/signup → /auth/verify-otp → /auth/login
👤 Profile:   GET /user/profile, PUT /user/labyrinth-profile
🎯 Match:     GET /matchmaking/user-recommendations, POST /matchmaking/swipe
💬 Chat:      POST /chat/direct, POST /chat/{chatId}/messages
📁 Project:   POST /projects, POST /projects/{projectId}/tasks
👥 Friends:   POST /friends/request, PUT /friends/{friendshipId}
📤 Media:     POST /media/avatar, POST /media/chat
🟢 Presence:  POST /users/heartbeat, GET /users/online/count
```

---

**Need Help?** Check Swagger UI for interactive testing: https://labyrinth-backend-api-production.up.railway.app/api-docs

**Support:** l217728@lhr.nu.edu.pk

---

## 📊 APPENDIX: Visual Workflows

### Authentication Flow
```
┌─────────────┐
│   Sign Up   │
│  /auth/     │
│  signup     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│ Email w/OTP │────▶│  Verify OTP  │
│   (sent)    │     │  /auth/      │
└─────────────┘     │  verify-otp  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  JWT Token   │
                    │   Returned   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Store Token │
                    │ (Secure!)    │
                    └──────────────┘

Subsequent Logins:
┌─────────────┐     ┌──────────────┐
│   Login     │────▶│  JWT Token   │
│  /auth/     │     │   Returned   │
│  login      │     └──────────────┘
└─────────────┘

Password Reset:
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Forgot    │────▶│  Email OTP   │────▶│  Verify OTP  │────▶│ Reset Pass   │
│  Password   │     │   (sent)     │     │  Get Token   │     │  New Pass    │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### User Profile Setup Flow
```
┌─────────────┐
│  New User   │
│ (post-auth) │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  GET /user/profile   │◀── Check if profile complete
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  PUT /user/          │◀── Basic info (name, bio)
│  labyrinth-profile   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  PUT /user/          │◀── Skills (React, Python, etc)
│  tech-stack          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  PUT /user/          │◀── Location, languages
│  demographic         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  POST /media/avatar  │◀── Profile picture
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Profile Complete!   │
└──────────────────────┘
```

### Matchmaking & Chat Flow
```
┌─────────────────────────────┐
│  GET /matchmaking/          │
│  user-recommendations       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Display Swipe Cards        │
│  (user profiles)            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  User Swipes Right/Left     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /matchmaking/swipe    │
│  { targetId, isRightSwipe } │
└──────┬──────────────────────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│  No Match    │              │  isMatch: true   │
│  Continue    │              │  (mutual like)   │
└──────────────┘              └────────┬─────────┘
                                       │
                                       ▼
                              ┌─────────────────────┐
                              │  Show Match Screen  │
                              │  "It's a Match!"    │
                              └────────┬────────────┘
                                       │
                                       ▼
                              ┌─────────────────────┐
                              │  POST /chat/direct  │
                              │  { targetUserId }   │
                              └────────┬────────────┘
                                       │
                                       ▼
                              ┌─────────────────────┐
                              │  Chat Created!      │
                              │  Navigate to chat   │
                              └─────────────────────┘
```

### Real-time Chat Flow
```
App Initialization:
┌─────────────────────────────┐
│  User Logs In               │
│  Store JWT Token            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Initialize Pusher Client   │
│  new Pusher(key, config)    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Set Auth Endpoint          │
│  /api/chat/pusher/auth      │
└─────────────────────────────┘

Opening a Chat:
┌─────────────────────────────┐
│  GET /chat/{chatId}         │
│  Get chat details           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  GET /chat/{chatId}/messages│
│  Load message history       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Subscribe to Channel       │
│  private-chat-{chatId}      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Bind Event Listeners:      │
│  - new-message              │
│  - typing                   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Chat Ready!                │
└─────────────────────────────┘

Sending Message:
┌─────────────────────────────┐
│  User Types & Sends         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /chat/{chatId}/messages│
│  { content, messageType }   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Backend:                   │
│  1. Save to DB              │
│  2. Broadcast via Pusher    │
└──────┬──────────────────────┘
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Sender UI   │  │ Recipient 1 │  │ Recipient 2 │
│ Updates     │  │ Receives    │  │ Receives    │
└─────────────┘  └─────────────┘  └─────────────┘

Typing Indicator:
┌─────────────────────────────┐
│  User Starts Typing         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /chat/{chatId}/typing │
│  { isTyping: true }         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Broadcast via Pusher       │
│  to all participants        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Other users see            │
│  "John is typing..."        │
└─────────────────────────────┘
```

### Project Creation & Management Flow
```
┌─────────────────────────────┐
│  POST /projects             │
│  { title, description,      │
│    workspaceName }          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Project Created            │
│  projectId returned         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /media/project-image  │
│  Upload cover image         │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /projects/{id}/       │
│  collaborators              │
│  Add team members (loop)    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /chat/project         │
│  Create group chat          │
│  (auto-adds all members)    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /projects/{id}/tasks  │
│  Create initial tasks (loop)│
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Project Setup Complete!    │
│  Navigate to dashboard      │
└─────────────────────────────┘

Task Management:
┌─────────────────────────────┐
│  GET /projects/{id}/tasks   │
│  ?status=PENDING            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Display Task Board         │
│  (Kanban-style)             │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  User Drag/Updates Task     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  PUT /projects/tasks/{id}   │
│  { status: "IN_PROGRESS" }  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Task Updated!              │
│  UI Reflects Change         │
└─────────────────────────────┘
```

### Friend System Flow
```
┌─────────────────────────────┐
│  GET /friends/search        │
│  ?query=john                │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Display Search Results     │
│  with friendshipStatus      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  User Clicks "Add Friend"   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /friends/request      │
│  { recipientId }            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Friend Request Sent!       │
│  (Status: PENDING_SENT)     │
└─────────────────────────────┘

Recipient Side:
┌─────────────────────────────┐
│  GET /friends/requests      │
│  (periodic polling or push) │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Show Friend Requests       │
│  (received array)           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  User Clicks Accept/Decline │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  PUT /friends/{friendshipId}│
│  { action: "accept" }       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Friendship Accepted!       │
│  Both users become friends  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  GET /friends/list          │
│  Display friends list       │
└─────────────────────────────┘
```

### Presence & Online Status Flow
```
App Lifecycle:
┌─────────────────────────────┐
│  App Launches / User Logs In│
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /users/heartbeat      │
│  (initial heartbeat)        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  User marked ONLINE         │
│  (TTL: 5 minutes)           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Start Heartbeat Interval   │
│  setInterval(120000) // 2min│
└──────┬──────────────────────┘
       │
       ├──────▶ Every 2 minutes
       │
       ▼
┌─────────────────────────────┐
│  POST /users/heartbeat      │
│  (keep-alive)               │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  User Stays ONLINE          │
│  (TTL refreshed)            │
└─────────────────────────────┘

App Background/Close:
┌─────────────────────────────┐
│  Stop Heartbeat Interval    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  After 5 min (TTL expires)  │
│  User marked OFFLINE        │
└─────────────────────────────┘

Displaying Online Status:
┌─────────────────────────────┐
│  GET /friends/list          │
│  (includes isOnline)        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Display Friends with       │
│  Green Dot (online)         │
│  Gray Dot (offline)         │
└─────────────────────────────┘

Dashboard Stats:
┌─────────────────────────────┐
│  GET /users/online/count    │
│  (poll every 30s)           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Display "47 users online"  │
└─────────────────────────────┘
```

### File Upload Flow
```
Avatar Upload:
┌─────────────────────────────┐
│  User Selects Image File    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Frontend Validation:       │
│  - Max 5MB                  │
│  - JPG/PNG/WebP only        │
│  - Compress if needed       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Create FormData            │
│  formData.append('avatar',  │
│    file)                    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /media/avatar         │
│  Content-Type: multipart/   │
│  form-data                  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Backend:                   │
│  1. Validate file           │
│  2. Upload to Supabase      │
│  3. Save metadata to DB     │
│  4. Return URL              │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Frontend:                  │
│  Update UI with new avatar  │
└─────────────────────────────┘

Chat Media Upload:
┌─────────────────────────────┐
│  User Selects Files         │
│  (can be multiple)          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /media/chat           │
│  FormData with chatId +     │
│  files array                │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Get uploadedFiles array    │
│  with URLs                  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /chat/{chatId}/       │
│  messages for each file     │
│  { messageType: "IMAGE",    │
│    mediaUrl: "..." }        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Messages appear in chat    │
│  with image/file previews   │
└─────────────────────────────┘
```

---

## 🎓 LLM Integration Tips

**For AI Assistants (Claude, GPT, etc.) helping with frontend integration:**

1. **Authentication First:** Always implement auth flow before any other feature
2. **Token Management:** Store in memory/secure storage, refresh on 401 errors
3. **Error Handling:** Wrap all API calls in try-catch, show user-friendly errors
4. **Loading States:** Add loading spinners for all async operations
5. **Optimistic UI:** Update UI immediately, rollback on error
6. **Real-time Setup:** Initialize Pusher once after login, reuse connection
7. **Pagination:** Implement infinite scroll for large lists (chat messages, projects, etc.)
8. **Debouncing:** Always debounce search inputs (300ms minimum)
9. **Image Optimization:** Compress images before upload using canvas API or library
10. **Offline Support:** Cache user profile, queue failed requests

**Example API Service Pattern (React Native):**

```javascript
// api/client.js
import axios from 'axios';

const API_BASE = 'https://labyrinth-backend-api-production.up.railway.app/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken(); // Your token storage method
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      navigateToLogin();
    }
    return Promise.reject(error);
  }
);

// api/auth.js
export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  verifyOTP: (data) => apiClient.post('/auth/verify-otp', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// api/chat.js
export const chatAPI = {
  getChats: () => apiClient.get('/chat'),
  getMessages: (chatId, page = 1) => 
    apiClient.get(`/chat/${chatId}/messages?page=${page}&limit=50`),
  sendMessage: (chatId, data) => 
    apiClient.post(`/chat/${chatId}/messages`, data),
  getDMMembers: (search = '') => 
    apiClient.get(`/chat/dmmembers${search ? `?search=${search}` : ''}`),
};

// api/matchmaking.js
export const matchmakingAPI = {
  getRecommendations: (limit = 20) => 
    apiClient.get(`/matchmaking/user-recommendations?limit=${limit}`),
  swipe: (data) => apiClient.post('/matchmaking/swipe', data),
  getMatches: () => apiClient.get('/matchmaking/matches'),
  getSwipeCount: () => apiClient.get('/matchmaking/swipe-count'),
};
```

**Example Pusher Setup (React Native):**

```javascript
import Pusher from 'pusher-js/react-native';

export const initializePusher = (authToken) => {
  const pusher = new Pusher('deb2b82031a08a5efae6', {
    cluster: 'ap2',
    authEndpoint: `${API_BASE}/chat/pusher/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  });

  return pusher;
};

export const subscribeToChatChannel = (pusher, chatId, callbacks) => {
  const channel = pusher.subscribe(`private-chat-${chatId}`);

  channel.bind('new-message', callbacks.onMessage);
  channel.bind('typing', callbacks.onTyping);

  return channel;
};

// Usage in component:
const [pusher, setPusher] = useState(null);
const [channel, setChannel] = useState(null);

useEffect(() => {
  const token = getStoredToken();
  const pusherClient = initializePusher(token);
  setPusher(pusherClient);

  return () => pusherClient.disconnect();
}, []);

useEffect(() => {
  if (!pusher || !chatId) return;

  const chatChannel = subscribeToChatChannel(pusher, chatId, {
    onMessage: (data) => {
      setMessages((prev) => [...prev, data]);
    },
    onTyping: (data) => {
      setTypingUsers((prev) => 
        data.isTyping 
          ? [...prev, data.username]
          : prev.filter(u => u !== data.username)
      );
    },
  });

  setChannel(chatChannel);

  return () => {
    if (chatChannel) chatChannel.unsubscribe();
  };
}, [pusher, chatId]);
```

**Example Heartbeat Implementation:**

```javascript
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { apiClient } from './api/client';

export const usePresenceHeartbeat = () => {
  const intervalRef = useRef(null);

  const sendHeartbeat = async () => {
    try {
      await apiClient.post('/users/heartbeat', {
        device_info: {
          platform: Platform.OS,
          version: '1.0.0',
        },
      });
    } catch (error) {
      console.error('Heartbeat failed:', error);
    }
  };

  useEffect(() => {
    // Send initial heartbeat
    sendHeartbeat();

    // Start interval (2 minutes)
    intervalRef.current = setInterval(sendHeartbeat, 120000);

    // Handle app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground, resume heartbeat
        sendHeartbeat();
        intervalRef.current = setInterval(sendHeartbeat, 120000);
      } else if (nextAppState === 'background') {
        // App went to background, stop heartbeat
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription.remove();
    };
  }, []);
};

// Usage in main App component:
function App() {
  const { isAuthenticated } = useAuth();
  usePresenceHeartbeat(); // Only active when authenticated

  return <NavigationContainer>{/* ... */}</NavigationContainer>;
}
```

---

**End of Documentation**

Generated: 2025-12-08  
Version: 3.0.1  
Base URL: https://labyrinth-backend-api-production.up.railway.app/api
