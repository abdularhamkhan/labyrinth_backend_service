# Labyrinth Backend API Documentation

**Base URL:** `http://localhost:3001`  
**Version:** 1.0  
**Last Updated:** December 2, 2025

---

## Table of Contents
1. [Authentication](#authentication)
2. [User Profile](#user-profile)
3. [Demographics](#demographics)
4. [Chat & Messaging](#chat--messaging)
5. [Projects](#projects)
6. [Matchmaking](#matchmaking)
7. [Friends](#friends)
8. [Presence](#presence)
9. [Real-time (Pusher)](#real-time-pusher)

---

## Authentication

### 1. Signup (Auto-verified for development)
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1995-05-15",
  "country": "Pakistan",
  "preferredLanguage": "English"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "status": "VERIFIED"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "expires_in": 3600
    }
  },
  "message": "Signup successful! Account auto-verified for development."
}
```

**Notes:**
- Password must be at least 8 characters
- Username must be unique and 3-30 characters
- Email must be unique and valid format
- Account is auto-verified in development mode (no OTP needed)

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "emailOrUsername": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "token": "eyJhbGc..."
  },
  "message": "Login successful"
}
```

---

### 3. Verify OTP (For password reset)
**Endpoint:** `POST /api/auth/verify-otp-reset`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully. You can now reset your password.",
  "data": {
    "verified": true
  }
}
```

---

### 4. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account with this email exists, a password reset verification code has been sent.",
  "data": {
    "emailSent": true,
    "expiresIn": "2 minutes"
  }
}
```

**Notes:**
- OTP expires in 2 minutes
- Email sent via Amazon SES
- Same response whether user exists or not (security)

---

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "passwordReset": true
  }
}
```

---

### 6. Forgot Username
**Endpoint:** `POST /api/auth/forgot-username`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account with this email exists, your username has been sent.",
  "data": {
    "emailSent": true
  }
}
```

---

## User Profile

**Authentication Required:** All endpoints require Bearer token in Authorization header  
**Header:** `Authorization: Bearer <token>`

### 1. Get Own Profile
**Endpoint:** `GET /api/user/profile`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "lastActive": "2025-12-02T06:00:00.000Z",
    "gitHubProfile": "https://github.com/johndoe",
    "education": "Bachelor",
    "createdAt": "2025-12-01T00:00:00.000Z",
    "updatedAt": "2025-12-02T06:00:00.000Z"
  }
}
```

---

### 2. Update Profile
**Endpoint:** `PUT /api/user/profile`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "gitHubProfile": "https://github.com/johnsmith",
  "education": "Master",
  "maxDailySwipes": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "user": { /* updated user object */ },
    "updated": true,
    "updatedFields": ["firstName", "lastName", "gitHubProfile"]
  }
}
```

---

### 3. Get User by ID
**Endpoint:** `GET /api/user/:userId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "education": "Bachelor",
    "gitHubProfile": "https://github.com/johndoe",
    "lastActive": "2025-12-02T06:00:00.000Z"
  }
}
```

---

## Demographics

### 1. Get Own Demographics
**Endpoint:** `GET /api/user/demographic`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "country": "Pakistan",
    "languages": ["English", "Urdu"]
  }
}
```

---

### 2. Get User Demographics by ID
**Endpoint:** `GET /api/user/:userId/demographics`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "country": "Pakistan",
    "languages": ["English", "Urdu"]
  }
}
```

---

### 3. Update Demographics
**Endpoint:** `PUT /api/user/demographic`

**Request Body:**
```json
{
  "country": "United States",
  "languages": ["English", "Spanish"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "country": "United States",
    "languages": ["English", "Spanish"],
    "updatedAt": "2025-12-02T06:00:00.000Z"
  }
}
```

---

## Chat & Messaging

### 1. Get All Chats
**Endpoint:** `GET /api/chat/my-chats`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "chat-uuid",
      "type": "DIRECT",
      "name": null,
      "lastMessageAt": "2025-12-02T06:00:00.000Z",
      "unreadCount": 3,
      "lastMessage": {
        "id": "msg-uuid",
        "content": "Hey there!",
        "messageType": "TEXT",
        "senderId": "uuid",
        "sender": {
          "id": "uuid",
          "username": "janedoe",
          "firstName": "Jane",
          "lastName": "Doe"
        },
        "createdAt": "2025-12-02T06:00:00.000Z"
      },
      "otherParticipants": [
        {
          "userId": "uuid",
          "user": {
            "id": "uuid",
            "username": "janedoe",
            "firstName": "Jane",
            "lastName": "Doe"
          }
        }
      ]
    }
  ]
}
```

---

### 2. Create Direct Chat
**Endpoint:** `POST /api/chat/direct`

**Request Body:**
```json
{
  "otherUserId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "chat-uuid",
    "type": "DIRECT",
    "participants": [ /* array of participants */ ],
    "messages": [],
    "createdAt": "2025-12-02T06:00:00.000Z"
  }
}
```

---

### 3. Send Message
**Endpoint:** `POST /api/chat/:chatId/message`

**Request Body:**
```json
{
  "content": "Hello! How are you?",
  "messageType": "TEXT"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "msg-uuid",
    "content": "Hello! How are you?",
    "messageType": "TEXT",
    "senderId": "uuid",
    "chatId": "chat-uuid",
    "sender": {
      "id": "uuid",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2025-12-02T06:00:00.000Z"
  }
}
```

**Notes:**
- Real-time broadcast via Pusher to channel: `private-chat-{chatId}`
- Event name: `new-message`

---

### 4. Get Chat Messages
**Endpoint:** `GET /api/chat/:chatId/messages?page=1&limit=50`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 50)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-uuid",
        "content": "Hello!",
        "messageType": "TEXT",
        "senderId": "uuid",
        "sender": {
          "id": "uuid",
          "username": "johndoe",
          "firstName": "John",
          "lastName": "Doe"
        },
        "createdAt": "2025-12-02T06:00:00.000Z"
      }
    ],
    "totalCount": 42,
    "hasMore": false
  }
}
```

**Notes:**
- First page cached for 5 minutes (Redis)
- Messages returned in chronological order

---

### 5. Set Typing Indicator
**Endpoint:** `POST /api/chat/:chatId/typing`

**Request Body:**
```json
{
  "isTyping": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Typing indicator set"
}
```

**Notes:**
- Broadcasts to Pusher channel: `private-chat-{chatId}`
- Event name: `typing`

---

### 6. Delete Message
**Endpoint:** `DELETE /api/chat/:chatId/message/:messageId`

**Response (200):**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

**Notes:**
- Broadcasts deletion to Pusher channel: `private-chat-{chatId}`
- Event name: `message-deleted`

---

### 7. Pusher Authentication
**Endpoint:** `POST /api/chat/pusher/auth`

**Request Body:**
```json
{
  "socket_id": "123456.789012",
  "channel_name": "private-chat-abc123"
}
```

**Response (200):**
```json
{
  "auth": "app-key:signature"
}
```

**Notes:**
- Used by Pusher client to authenticate private channels
- Verifies user is participant in the chat

---

## Projects

### 1. Create Project
**Endpoint:** `POST /api/projects`

**Request Body:**
```json
{
  "title": "AI Chatbot",
  "description": "Building an intelligent chatbot using NLP",
  "workspaceName": "AI Workspace",
  "workspaceDescription": "Workspace for AI projects",
  "techStackIds": ["tech-stack-uuid-1", "tech-stack-uuid-2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "project-uuid",
    "title": "AI Chatbot",
    "description": "Building an intelligent chatbot using NLP",
    "workspace": { /* workspace object */ },
    "collaborators": [ /* array of collaborators */ ],
    "techStacks": [ /* array of tech stacks */ ],
    "tasks": [],
    "createdAt": "2025-12-02T06:00:00.000Z"
  }
}
```

---

### 2. Get Project Details
**Endpoint:** `GET /api/projects/:projectId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "project-uuid",
    "title": "AI Chatbot",
    "description": "Building an intelligent chatbot",
    "workspace": {
      "id": "workspace-uuid",
      "name": "AI Workspace",
      "description": "Workspace for AI projects"
    },
    "collaborators": [
      {
        "id": "uuid",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "techStack": {
          "frameworks": ["React", "Node.js"],
          "languages": ["JavaScript", "Python"],
          "tools": ["Git", "Docker"]
        }
      }
    ],
    "techStacks": [ /* tech stacks */ ],
    "tasks": [ /* recent 10 tasks */ ],
    "_count": {
      "collaborators": 3,
      "tasks": 15
    }
  }
}
```

**Notes:**
- Cached for 10 minutes (Redis)
- Cache key: `project:{projectId}`

---

### 3. Update Project
**Endpoint:** `PUT /api/projects/:projectId`

**Request Body:**
```json
{
  "title": "Advanced AI Chatbot",
  "description": "Updated description",
  "techStackIds": ["new-tech-stack-uuid"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    /* updated project object */
  }
}
```

**Notes:**
- Requires WRITE or MANAGE_USERS permission
- Invalidates project cache

---

### 4. Search Projects
**Endpoint:** `GET /api/projects/search?q=chatbot&techStacks=JavaScript,Python`

**Query Parameters:**
- `q` (optional): Search keyword
- `techStacks` (optional): Comma-separated tech stack names

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "project-uuid",
      "title": "AI Chatbot",
      "description": "Building an intelligent chatbot",
      "workspace": { /* workspace */ },
      "collaboratorsCount": 3,
      "tasksCount": 15,
      "techStacks": [ /* tech stacks */ ]
    }
  ]
}
```

---

### 5. Get Project Activity
**Endpoint:** `GET /api/projects/:projectId/activity`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-uuid",
      "title": "Implement login feature",
      "status": "COMPLETED",
      "assignedToId": "uuid",
      "assignedTo": {
        "username": "johndoe",
        "firstName": "John"
      },
      "createdAt": "2025-12-01T00:00:00.000Z",
      "completedAt": "2025-12-02T00:00:00.000Z"
    }
  ]
}
```

---

### 6. Get Project Analytics
**Endpoint:** `GET /api/projects/:projectId/analytics`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalTasks": 15,
    "completedTasks": 8,
    "inProgressTasks": 5,
    "todoTasks": 2,
    "completionRate": 53.33,
    "averageCompletionTime": "2.5 days",
    "tasksByStatus": {
      "TODO": 2,
      "IN_PROGRESS": 5,
      "COMPLETED": 8
    }
  }
}
```

---

## Matchmaking

### 1. Get User Recommendations
**Endpoint:** `GET /api/matchmaking/recommendations?limit=20`

**Query Parameters:**
- `limit` (optional, default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "janedoe",
      "firstName": "Jane",
      "lastName": "Doe",
      "education": "Master",
      "gitHubProfile": "https://github.com/janedoe",
      "techStack": {
        "languages": ["JavaScript", "Python"],
        "frameworks": ["React", "Django"],
        "tools": ["Git", "Docker"]
      },
      "demographic": {
        "country": "Pakistan",
        "languages": ["English", "Urdu"]
      },
      "compatibilityScore": 85.5,
      "projectsCount": 5,
      "workspacesCount": 3,
      "lastActive": "2025-12-02T06:00:00.000Z"
    }
  ]
}
```

**Notes:**
- Cached for 1 hour (Redis)
- Excludes already swiped and matched users
- Minimum compatibility threshold: 30%
- Sorted by compatibility score (descending)

---

### 2. Get Project Recommendations
**Endpoint:** `GET /api/matchmaking/recommendations/projects?limit=10`

**Query Parameters:**
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "project-uuid",
      "title": "AI Chatbot",
      "description": "Building an intelligent chatbot",
      "workspace": {
        "name": "AI Workspace",
        "description": "Workspace for AI projects"
      },
      "collaboratorsCount": 2,
      "tasksCount": 10,
      "techStacks": [
        {
          "languages": ["Python"],
          "frameworks": ["TensorFlow"],
          "tools": ["Jupyter"]
        }
      ],
      "compatibilityScore": 78.2,
      "createdAt": "2025-12-01T00:00:00.000Z"
    }
  ]
}
```

**Notes:**
- Cached for 1 hour (Redis)
- Excludes user's own projects and swiped projects
- Minimum compatibility threshold: 20%
- Prioritizes smaller teams

---

### 3. Swipe on User
**Endpoint:** `POST /api/matchmaking/swipe`

**Request Body:**
```json
{
  "swipeeUserId": "uuid",
  "direction": "RIGHT"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "swipe": {
      "id": "swipe-uuid",
      "swiperUserId": "uuid",
      "swipeeUserId": "uuid",
      "direction": "RIGHT",
      "createdAt": "2025-12-02T06:00:00.000Z"
    },
    "matched": true,
    "match": {
      "id": "match-uuid",
      "user1Id": "uuid",
      "user2Id": "uuid",
      "createdAt": "2025-12-02T06:00:00.000Z"
    }
  }
}
```

**Notes:**
- Daily swipe limit enforced (default: 50)
- If mutual right swipe, creates a match
- Publishes Kafka events: SWIPE_ACTION, MATCH_CREATED (if matched)
- Notifies matched user via Pusher: `private-user-{userId}` event: `new-match`

---

### 4. Get My Matches
**Endpoint:** `GET /api/matchmaking/matches`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "match-uuid",
      "matchedUser": {
        "id": "uuid",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "techStack": { /* tech stack */ },
        "demographic": { /* demographic */ }
      },
      "createdAt": "2025-12-02T06:00:00.000Z"
    }
  ]
}
```

---

### 5. Get Swipe History
**Endpoint:** `GET /api/matchmaking/swipes`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "swipe-uuid",
      "direction": "RIGHT",
      "swipeeUser": {
        "id": "uuid",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe"
      },
      "createdAt": "2025-12-02T06:00:00.000Z"
    }
  ]
}
```

---

## Friends

### 1. Send Friend Request
**Endpoint:** `POST /api/friends/request`

**Request Body:**
```json
{
  "recipientId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "friend-request-uuid",
    "requesterId": "uuid",
    "recipientId": "uuid",
    "status": "PENDING",
    "createdAt": "2025-12-02T06:00:00.000Z"
  }
}
```

---

### 2. Accept Friend Request
**Endpoint:** `POST /api/friends/accept/:requestId`

**Response (200):**
```json
{
  "success": true,
  "message": "Friend request accepted",
  "data": {
    "friendship": {
      "id": "friendship-uuid",
      "user1Id": "uuid",
      "user2Id": "uuid",
      "createdAt": "2025-12-02T06:00:00.000Z"
    }
  }
}
```

---

### 3. Get All Friends
**Endpoint:** `GET /api/friends`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "janedoe",
      "firstName": "Jane",
      "lastName": "Doe",
      "lastActive": "2025-12-02T06:00:00.000Z"
    }
  ]
}
```

---

## Presence

### 1. Set User Online
**Endpoint:** `POST /api/presence/online`

**Request Body:**
```json
{
  "platform": "web",
  "source": "manual"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User marked as online"
}
```

---

### 2. Set User Offline
**Endpoint:** `POST /api/presence/offline`

**Response (200):**
```json
{
  "success": true,
  "message": "User marked as offline"
}
```

---

### 3. Get User Presence
**Endpoint:** `GET /api/presence/:userId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "status": "online",
    "lastSeen": "2025-12-02T06:00:00.000Z",
    "platform": "web"
  }
}
```

---

## Real-time (Pusher)

### Channel Types

#### 1. Private User Channel
**Channel:** `private-user-{userId}`

**Events:**
- `new-chat` - New chat created
- `added-to-chat` - Added to a chat
- `new-match` - New matchmaking match

#### 2. Private Chat Channel
**Channel:** `private-chat-{chatId}`

**Events:**
- `new-message` - New message sent
- `typing` - User typing indicator
- `message-deleted` - Message deleted

#### 3. Presence Chat Channel
**Channel:** `presence-chat-{chatId}`

**Purpose:** Track online users in a chat

---

### Frontend Integration (React Native Example)

```javascript
import Pusher from 'pusher-js/react-native';

// Initialize Pusher
const pusher = new Pusher('deb2b82031a08a5efae6', {
  cluster: 'ap2',
  authEndpoint: 'http://localhost:3001/api/chat/pusher/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  }
});

// Subscribe to private user channel
const userChannel = pusher.subscribe(`private-user-${userId}`);

userChannel.bind('new-chat', (data) => {
  console.log('New chat:', data.chat);
  // Handle new chat notification
});

userChannel.bind('new-match', (data) => {
  console.log('New match:', data.match);
  // Handle new match notification
});

// Subscribe to private chat channel
const chatChannel = pusher.subscribe(`private-chat-${chatId}`);

chatChannel.bind('new-message', (data) => {
  console.log('New message:', data.message);
  // Add message to UI
});

chatChannel.bind('typing', (data) => {
  console.log('User typing:', data.username, data.isTyping);
  // Show/hide typing indicator
});

// Clean up on unmount
pusher.unsubscribe(`private-user-${userId}`);
pusher.unsubscribe(`private-chat-${chatId}`);
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes:
- `AUTHENTICATION_FAILED` - Invalid credentials
- `TOKEN_EXPIRED` - JWT token expired
- `UNAUTHORIZED` - Missing or invalid token
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `CONFLICT` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## Environment Setup

### Required Services
1. **PostgreSQL** (Supabase) - Connected ✅
2. **Redis** - Connected ✅
3. **Pusher** - Configured ✅
4. **Amazon SES** - Configured ✅
5. **Kafka** - Optional for development

### Credentials Configured:
- Supabase: ✅
- Redis: ✅ (localhost:6379)
- Pusher: ✅ (App ID: 2085527, Cluster: ap2)
- Amazon SES: ✅ (Region: eu-north-1)

---

## Testing Checklist

### Authentication
- ✅ Signup (auto-verified)
- ✅ Login
- ✅ Forgot password (OTP via SES)
- ✅ Reset password
- ✅ Forgot username

### User Profile
- ✅ Get profile
- ✅ Update profile
- ✅ Demographics CRUD

### Chat
- ✅ Create direct chat
- ✅ Send message (with Pusher broadcast)
- ✅ Get messages (with caching)
- ✅ Typing indicator
- ✅ Pusher authentication

### Projects
- ✅ Create project
- ✅ Get project (with caching)
- ✅ Update project
- ✅ Search projects
- ✅ Project analytics

### Matchmaking
- ✅ User recommendations (with caching)
- ✅ Project recommendations (with caching)
- ✅ Swipe (with match detection)
- ✅ Get matches

---

## Performance Notes

### Caching Strategy (Redis):
- **User Profiles:** 15 min TTL
- **Demographics:** 15 min TTL
- **Recommendations:** 1 hour TTL
- **Chat Messages:** 5 min TTL (first page only)
- **Project Details:** 10 min TTL

### Real-time Features:
- Chat messages broadcast instantly via Pusher
- Typing indicators with minimal latency
- Match notifications in real-time

### Event-Driven Architecture:
- Kafka publishes events for analytics
- Consumer handles: USER, CHAT, MATCH, PROJECT events
- Graceful degradation in development (Kafka optional)

---

## Contact & Support

For issues or questions, contact the backend team.

**Server Status:** Running on port 3001  
**Health Check:** `GET /health`
