# 🚀 **COMPLETE API REFERENCE - A to Z ENDPOINTS**

**WAT Game Backend API Specification**

**Version:** 1.2.0  
**Base URL:** `http://localhost:3000` (Development) | `https://wat.vcern.com` (Production)  
**Documentation Date:** August 25, 2025

---

## 📋 **TABLE OF CONTENTS**

1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Presence & Status Tracking](#presence--status-tracking)
4. [Friends & Social Features](#friends--social-features)
5. [Leaderboards & Rankings](#leaderboards--rankings)
6. [Error Handling](#error-handling)
7. [Rate Limits & Security](#rate-limits--security)

---

## 🔐 **AUTHENTICATION & AUTHORIZATION**

All protected endpoints require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

### **📊 ENDPOINT SUMMARY**
- **5 Authentication Endpoints**
- **Base Route:** `/api/auth`
- **Authentication Required:** ❌ (Public endpoints)

---

### **AUTH-001: User Registration**
```http
POST /api/auth/signup
```

**Description:** Register a new user account and send OTP for verification.

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "username": "john_doe",
  "password": "StrongPass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Sign up complete. Please verify your email via OTP sent to you.",
  "data": {
    "requiresVerification": true,
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### **AUTH-002: Email Verification**
```http
POST /api/auth/verify-otp
```

**Description:** Verify email using OTP and receive JWT token.

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
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **AUTH-003: User Login**
```http
POST /api/auth/login
```

**Description:** Authenticate user with email/username and password.

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```


---

### **AUTH-004: Forgot Password**
```http
POST /api/auth/forgot-password
```

**Description:** Initiate password reset process by sending reset email.

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
  "message": "If an account with this email exists, a password reset link will be sent.",
  "data": {
    "emailSent": true
  }
}
```

**Security Note:** Returns success message regardless of email existence to prevent user enumeration.

---

### **AUTH-005: Reset Password**
```http
POST /api/auth/reset-password
```

**Description:** Complete password reset using secure token from email.

**Request Body:**
```json
{
  "token": "secure_reset_token_from_email",
  "password": "NewStrongPass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password has been successfully reset. Please log in with your new password.",
  "data": {
    "passwordReset": true,
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Security Features:**
- Tokens expire after 1 hour
- Single-use tokens (cannot be reused)
- All user sessions invalidated after reset

---

## 👤 **USER MANAGEMENT**

### **📊 ENDPOINT SUMMARY**
- **5 User Management Endpoints**
- **Base Route:** `/api/user`
- **Authentication Required:** ✅ (All endpoints)

---

### **USER-001: Get User Profile**
```http
GET /api/user/profile
```

**Description:** Retrieve current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```


---

### **USER-002: Update User Profile**
```http
PUT /api/user/profile
```

**Description:** Update current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "john_smith"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "username": "john_smith",
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+1234567890",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T12:45:00Z"
    },
    "updated": true,
    "updatedFields": ["firstName", "lastName", "username"]
  }
}
```

---

### **USER-003: Upload Avatar**
```http
POST /api/user/avatar
```

**Description:** Upload user avatar image.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body:** (Form Data)
- `avatar`: Image file (max 5MB, JPG/PNG)

**Response (200):**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "newAvatarUrl": "https://storage.example.com/avatars/user123.jpg"
  }
}
```

---

### **USER-004: Delete Avatar**
```http
DELETE /api/user/avatar
```

**Description:** Remove user's avatar image.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Avatar deleted successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### **USER-005: Delete Account**
```http
DELETE /api/user/account
```

**Description:** Permanently delete user account.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": {
    "deletedUserId": "550e8400-e29b-41d4-a716-446655440000",
    "deletedUsername": "john_doe"
  }
}
```

---

## 👥 **PRESENCE & STATUS TRACKING**

### **📊 ENDPOINT SUMMARY**
- **6 Presence Tracking Endpoints**
- **Base Route:** `/api/users`
- **Authentication Required:** ✅ (All endpoints)
- **Special Features:** Redis-powered real-time tracking

---

### **PRESENCE-001: Get Users (Main Hybrid Endpoint)**
```http
GET /api/users
```

**Description:** Main endpoint for retrieving users with smart pagination and status filtering.

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `status` | `"online"` \| `"offline"` | `"online"` | - | Filter by user status |
| `page` | `number` | `1` | - | Page number |
| `limit` | `number` | `50` | `100` | Results per page |
| `include` | `"stats"` | `false` | - | Include game statistics |
| `hours_back` | `number` | `24` | `168` | Hours back for offline users |

**Examples:**

**Get Online Users with Stats:**
```http
GET /api/users?status=online&page=1&limit=50&include=stats
```

**Get Offline Users (last 24 hours):**
```http
GET /api/users?status=offline&page=1&limit=50
```

**Get All Users (defaults to online):**
```http
GET /api/users?page=1&limit=50
```

**Response (200):**
```json
{
  "success": true,
  "message": "Online users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "player1",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar1.jpg",
        "status": "online",
        "isOnline": true,
        "totalScore": 1500,
        "gamesPlayed": 25,
        "gamesWon": 18,
        "winRate": 72.0,
        "currentStreak": 5,
        "globalRank": 12,
        "lastActive": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    },
    "metadata": {
      "retrievedAt": "2024-01-15T10:30:00Z",
      "statusFilter": "online",
      "includesStats": true
    }
  }
}
```


**Rate Limit:** 60 requests per minute

---

### **PRESENCE-002: Get Online Count**
```http
GET /api/users/online/count
```

**Description:** Lightweight endpoint for getting online user count (dashboard use).

**Response (200):**
```json
{
  "success": true,
  "message": "Online count retrieved successfully",
  "data": {
    "onlineCount": 247,
    "totalRegistered": 1520,
    "onlinePercentage": 16.25,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```


**Rate Limit:** 120 requests per minute

---

### **PRESENCE-003: Update Heartbeat**
```http
POST /api/users/heartbeat
```

**Description:** Keep-alive mechanism. Clients should call every 2 minutes to maintain online status.

**Request Body (Optional):**
```json
{
  "device_info": {
    "platform": "mobile",
    "version": "1.0.5",
    "os": "iOS 17.2"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Heartbeat updated successfully",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Rate Limit:** 60 requests per minute

---

### **PRESENCE-004: Get My Presence**
```http
GET /api/users/me/presence
```

**Description:** Get current user's presence information.

**Response (200):**
```json
{
  "success": true,
  "message": "User presence retrieved successfully",
  "data": {
    "presence": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "isOnline": true,
      "lastSeen": "2024-01-15T10:30:00Z",
      "deviceInfo": {
        "platform": "mobile",
        "version": "1.0"
      }
    },
    "retrievedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Rate Limit:** 120 requests per minute

---

### **PRESENCE-005: Get Presence Statistics**
```http
GET /api/users/presence/stats
```

**Description:** Platform-wide presence statistics (admin/analytics use).

**Response (200):**
```json
{
  "success": true,
  "message": "Presence statistics retrieved successfully",
  "data": {
    "statistics": {
      "totalOnline": 247,
      "totalRegistered": 1520,
      "onlinePercentage": 16.25,
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    "retrievedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Rate Limit:** 30 requests per minute

---

### **PRESENCE-006: Search Users**
```http
GET /api/users/search
```

**Description:** Search users by username with case-insensitive matching.

**Query Parameters:**
- `query`: Search term (required, 1-50 characters)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10, max: 50)
- `include`: "stats" for game statistics (optional)

**Example:**
```http
GET /api/users/search?query=john&page=1&limit=10&include=stats
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users found for query: \"john\"",
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar.jpg",
        "status": "online",
        "isOnline": true,
        "lastActive": "2024-01-15T10:30:00Z",
        "totalScore": 1200,
        "globalRank": 15
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    },
    "metadata": {
      "retrievedAt": "2024-01-15T10:30:00Z",
      "searchQuery": "john",
      "includeStats": true
    }
  }
}
```

**Rate Limit:** 60 requests per minute

---

## 👫 **FRIENDS & SOCIAL FEATURES**

### **📊 ENDPOINT SUMMARY**
- **9 Social Interaction Endpoints**
- **Base Route:** `/api/friends`
- **Authentication Required:** ✅ (All endpoints)

---

### **FRIENDS-001: Send Friend Request**
```http
POST /api/friends/request
```

**Description:** Send a friend request to another user.

**Request Body:**
```json
{
  "recipientId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Friend request sent successfully",
  "data": {
    "friendshipId": "660e8400-e29b-41d4-a716-446655440002",
    "status": "PENDING",
    "recipient": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "username": "jane_doe"
    }
  }
}
```


---

### **FRIENDS-002: Get Friend Requests**
```http
GET /api/friends/requests
```

**Description:** Get user's sent and received friend requests with pagination.

**Query Parameters:**
- `limit`: Results per page (default: 20)
- `offset`: Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "message": "Friend requests retrieved successfully",
  "data": {
    "sent": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "status": "PENDING",
        "recipient": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "username": "jane_doe",
          "avatar": "https://example.com/jane.jpg"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "received": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440003",
        "status": "PENDING",
        "requester": {
          "id": "550e8400-e29b-41d4-a716-446655440004",
          "username": "bob_smith",
          "avatar": "https://example.com/bob.jpg"
        },
        "createdAt": "2024-01-15T09:15:00Z"
      }
    ],
    "totalSent": 1,
    "totalReceived": 1
  },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "hasMoreSent": false,
    "hasMoreReceived": false
  }
}
```

---

### **FRIENDS-003: Manage Friendship**
```http
PUT /api/friends/:friendshipId
```

**Description:** Accept, decline, or remove a friendship.

**URL Parameters:**
- `friendshipId`: UUID of the friendship

**Request Body:**
```json
{
  "action": "accept"
}
```

**Possible Actions:**
- `"accept"` - Accept friend request
- `"decline"` - Decline friend request  
- `"remove"` - Remove existing friendship

**Response (200):**
```json
{
  "success": true,
  "message": "Friend request accepted successfully",
  "data": {
    "friendshipId": "660e8400-e29b-41d4-a716-446655440002",
    "action": "accept",
    "status": "ACCEPTED",
    "friend": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "username": "jane_doe",
      "avatar": "https://example.com/jane.jpg"
    }
  }
}
```


---

### **FRIENDS-004: Get Friends List**
```http
GET /api/friends/list
```

**Description:** Get user's friends list with pagination.

**Query Parameters:**
- `limit`: Results per page (default: 20)
- `offset`: Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "message": "Friends list retrieved successfully",
  "data": {
    "friends": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "username": "jane_doe",
        "firstName": "Jane",
        "lastName": "Doe",
        "avatar": "https://example.com/jane.jpg",
        "totalScore": 1800,
        "isOnline": true,
        "lastActive": "2024-01-15T10:30:00Z",
        "friendshipId": "660e8400-e29b-41d4-a716-446655440002"
      }
    ],
    "totalCount": 15
  },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### **FRIENDS-005: Block/Unblock User**
```http
PUT /api/friends/block/:targetUserId
```

**Description:** Block or unblock a user.

**URL Parameters:**
- `targetUserId`: UUID of user to block/unblock

**Request Body:**
```json
{
  "action": "block"
}
```

**Possible Actions:**
- `"block"` - Block the user
- `"unblock"` - Unblock the user

**Response (200):**
```json
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "action": "block",
    "targetUser": {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "username": "spam_user"
    },
    "status": "BLOCKED"
  }
}
```

---

### **FRIENDS-006: Search Users (Social Context)**
```http
GET /api/friends/search
```

**Description:** Search users with friendship status context.

**Query Parameters:**
- `query`: Search term (required)
- `limit`: Results per page (default: 10)
- `offset`: Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "message": "User search completed successfully",
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440006",
        "username": "new_player",
        "firstName": "New",
        "lastName": "Player",
        "avatar": "https://example.com/new.jpg",
        "totalScore": 500,
        "friendshipStatus": "NONE"
      }
    ],
    "totalCount": 1,
    "query": "new",
    "hasMore": false
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

**Friendship Status Values:**
- `"NONE"` - No relationship
- `"PENDING_SENT"` - Friend request sent by current user
- `"PENDING_RECEIVED"` - Friend request received from this user
- `"ACCEPTED"` - Already friends
- `"BLOCKED"` - User is blocked

---

### **FRIENDS-007: Get User Profile with Friendship Status**
```http
GET /api/friends/profile/:userId
```

**Description:** Get another user's public profile with friendship relationship status.

**URL Parameters:**
- `userId`: UUID of the user

**Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440007",
      "username": "pro_player",
      "firstName": "Pro",
      "lastName": "Player",
      "avatar": "https://example.com/pro.jpg",
      "totalScore": 5000,
      "friendshipStatus": "ACCEPTED"
    }
  }
}
```

---

### **FRIENDS-008: Get Friendship Statistics**
```http
GET /api/friends/stats
```

**Description:** Get comprehensive friendship statistics for the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "message": "Friendship statistics retrieved successfully",
  "data": {
    "totalFriends": 15,
    "pendingSent": 2,
    "pendingReceived": 3,
    "blockedUsers": 1
  }
}
```

---

### **FRIENDS-009: Get Friend Activity Status**
```http
GET /api/friends/activity
```

**Description:** Get activity status for user's friends (online status, current games).

**Query Parameters:**
- `friendIds`: Comma-separated UUIDs (optional - if not provided, gets all friends)

**Response (200):**
```json
{
  "success": true,
  "message": "Friend activity status retrieved successfully",
  "data": {
    "friends": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "username": "jane_doe",
        "isOnline": true,
        "lastActive": "2024-01-15T10:30:00Z",
        "currentGame": null,
        "status": "online"
      }
    ],
    "summary": {
      "totalFriends": 15,
      "onlineFriends": 8,
      "friendsInGame": 3
    }
  }
}
```

---

## 🏆 **LEADERBOARDS & RANKINGS**

### **📊 ENDPOINT SUMMARY**
- **5 Leaderboard Endpoints**
- **Base Route:** `/api/app/leaderboard`
- **Authentication Required:** Mixed (public + protected)

---

### **LEADERBOARD-001: Global Leaderboard**
```http
GET /api/app/leaderboard/global
```

**Description:** Get global leaderboard rankings (public endpoint).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 50, max: 100)

**Response (200):**
```json
{
  "success": true,
  "message": "Global leaderboard retrieved successfully",
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "550e8400-e29b-41d4-a716-446655440001",
        "username": "champion_player",
        "firstName": "Champion",
        "lastName": "Player",
        "avatar": "https://example.com/champion.jpg",
        "totalScore": 15000,
        "gamesPlayed": 150,
        "gamesWon": 135,
        "winRate": 90.0,
        "currentStreak": 25,
        "bestStreak": 30
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1520,
      "totalPages": 31
    },
    "metadata": {
      "type": "global",
      "lastUpdated": "2024-01-15T10:00:00Z"
    }
  }
}
```


**Authentication Required:** ❌ (Public)

---

### **LEADERBOARD-002: Weekly Leaderboard**
```http
GET /api/app/leaderboard/weekly
```

**Description:** Get weekly leaderboard rankings (public endpoint).

**Response:** Similar structure to global leaderboard with weekly-specific data.

**Authentication Required:** ❌ (Public)

---

### **LEADERBOARD-003: Daily Leaderboard**
```http
GET /api/app/leaderboard/daily
```

**Description:** Get daily leaderboard rankings (public endpoint).

**Response:** Similar structure to global leaderboard with daily-specific data.

**Authentication Required:** ❌ (Public)

---

### **LEADERBOARD-004: Get User Rank**
```http
GET /api/app/leaderboard/rank/:type
```

**Description:** Get authenticated user's rank in specified leaderboard.

**URL Parameters:**
- `type`: Leaderboard type (`global`, `weekly`, `daily`)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User rank retrieved successfully",
  "data": {
    "rank": {
      "position": 156,
      "totalScore": 2500,
      "percentile": 85.2,
      "type": "global"
    },
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "current_user"
    }
  }
}
```

**Authentication Required:** ✅

---

### **LEADERBOARD-005: Rebuild Leaderboard**
```http
POST /api/app/leaderboard/rebuild/:type
```

**Description:** Manually trigger leaderboard rebuild (admin function).

**URL Parameters:**
- `type`: Leaderboard type (`global`, `weekly`, `daily`)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Leaderboard rebuild initiated successfully",
  "data": {
    "type": "global",
    "rebuildId": "rebuild-550e8400-e29b-41d4-a716-446655440000",
    "estimatedTime": "2-3 minutes"
  }
}
```

**Authentication Required:** ✅

---

## ❌ **ERROR HANDLING**

### **Standard Error Response Format**
```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_550e8400-e29b-41d4-a716-446655440000"
}
```

### **HTTP Status Codes**

| Code | Description | When it occurs |
|------|-------------|----------------|
| `200` | Success | Request completed successfully |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Missing/invalid authentication token |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource conflict (e.g., duplicate email) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side error |

### **Common Error Examples**

**Authentication Error (401):**
```json
{
  "success": false,
  "error": "AuthenticationError",
  "message": "Authentication token is invalid or expired",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid input data provided",
  "details": "Password must be at least 8 characters long",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Rate Limit Error (429):**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```


---

## 🔒 **RATE LIMITS & SECURITY**

### **Rate Limit Overview**

| Endpoint Category | Rate Limit | Window | Headers Included |
|------------------|------------|--------|------------------|
| Authentication | 100 requests | 15 minutes | ✅ |
| Main User Actions | 60 requests | 1 minute | ✅ |
| Lightweight Endpoints | 120 requests | 1 minute | ✅ |
| Analytics/Stats | 30 requests | 1 minute | ✅ |

### **Rate Limit Headers**

All responses include rate limit information:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642234567
```

### **Security Features**

1. **JWT Authentication**
   - Tokens expire after configured time
   - Secure token generation
   - Token refresh mechanism

2. **Input Validation**
   - Zod schema validation
   - SQL injection prevention
   - XSS protection

3. **Password Security**
   - Bcrypt hashing
   - Strong password requirements
   - Password reset tokens with expiration

4. **CORS Configuration**
   - Configured for specific origins
   - Credentials handling

5. **Helmet Security Headers**
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options

---


## 📊 **SUMMARY**

### **Total API Endpoints: 30**

| Category | Count | Authentication |
|----------|-------|----------------|
| Authentication | 5 | Public |
| User Management | 5 | Protected |
| Presence & Status | 6 | Protected |
| Friends & Social | 9 | Protected |
| Leaderboards | 5 | Mixed |

### **Key Features Implemented**

✅ **Authentication System**
- User registration with OTP verification
- JWT-based authentication
- Password reset functionality
- Secure token management

✅ **User Management**
- Profile management (CRUD operations)
- Avatar upload/management
- Account deletion

✅ **Real-time Presence System**
- Redis-powered online/offline tracking
- Heartbeat mechanism
- Smart pagination for millions of users
- Advanced search functionality

✅ **Social Features**
- Friend request system
- Friendship management
- User blocking/unblocking
- Activity tracking

✅ **Leaderboard System**
- Global, weekly, and daily rankings
- User rank tracking
- Public leaderboards

✅ **Enterprise Features**
- Comprehensive error handling
- Rate limiting
- Input validation
- Security headers
- Full TypeScript support



This API is **production-ready** and provides all necessary endpoints for a complete gaming social platform! 🚀
