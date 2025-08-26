# Friends API Documentation

## Overview

The Friends API provides comprehensive friendship management functionality for the mobile app backend. All endpoints require authentication via JWT token in the Authorization header.

**Base URL:** `/api/friends`

**Authentication:** All endpoints require `Authorization: Bearer <jwt_token>`

---

## 📋 Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/request` | Send friend request |
| GET | `/requests` | Get friend requests (sent/received) |
| PUT | `/:friendshipId` | Accept/decline/remove friendship |
| GET | `/list` | Get friends list |
| PUT | `/block/:targetUserId` | Block/unblock user |
| GET | `/search` | Search users with friendship context |
| GET | `/profile/:userId` | Get user profile with friendship status |
| GET | `/stats` | Get friendship statistics |
| GET | `/activity` | Get friend activity status |

---

## 🔗 Detailed Endpoints

### 1. Send Friend Request

**POST** `/api/friends/request`

Sends a friend request to another user.

#### Request
```json
{
  "recipientId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Friend request sent successfully",
  "data": {
    "friendshipId": "123e4567-e89b-12d3-a456-426614174000",
    "status": "PENDING",
    "recipient": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe"
    }
  }
}
```

#### Error Responses
- `400` - Cannot send request to yourself
- `409` - Already friends or request already sent
- `403` - User is blocked
- `404` - User not found

---

### 2. Get Friend Requests

**GET** `/api/friends/requests?limit=20&offset=0`

Retrieves user's sent and received friend requests with pagination.

#### Query Parameters
- `limit` (optional): Number of results per type (default: 20, max: 100)
- `offset` (optional): Number of results to skip (default: 0)

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Friend requests retrieved successfully",
  "data": {
    "sent": [
      {
        "friendshipId": "123e4567-e89b-12d3-a456-426614174000",
        "user": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "status": "PENDING"
      }
    ],
    "received": [
      {
        "friendshipId": "987fcdeb-51a2-43d1-9876-543210987654",
        "user": {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "username": "jane_smith",
          "firstName": "Jane",
          "lastName": "Smith",
          "avatar": null
        },
        "createdAt": "2024-01-16T14:20:00Z",
        "status": "PENDING"
      }
    ],
    "totalSent": 3,
    "totalReceived": 5
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

### 3. Manage Friendship

**PUT** `/api/friends/:friendshipId`

Accepts, declines, or removes a friendship.

#### URL Parameters
- `friendshipId`: UUID of the friendship to manage

#### Request
```json
{
  "action": "accept"  // "accept" | "decline" | "remove"
}
```

#### Response (200 OK) - Accept
```json
{
  "success": true,
  "message": "Friend request accepted successfully",
  "data": {
    "friendshipId": "123e4567-e89b-12d3-a456-426614174000",
    "action": "accept",
    "status": "ACCEPTED",
    "friend": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

#### Response (200 OK) - Decline
```json
{
  "success": true,
  "message": "Friend request declined successfully",
  "data": {
    "friendshipId": "123e4567-e89b-12d3-a456-426614174000",
    "action": "decline",
    "status": "REJECTED"
  }
}
```

#### Response (200 OK) - Remove
```json
{
  "success": true,
  "message": "Friendship removed successfully",
  "data": {
    "friendshipId": "123e4567-e89b-12d3-a456-426614174000",
    "action": "remove"
  }
}
```

---

### 4. Get Friends List

**GET** `/api/friends/list?limit=20&offset=0`

Retrieves user's friends list with pagination.

#### Query Parameters
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Number of results to skip (default: 0)

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Friends list retrieved successfully",
  "data": {
    "friends": [
      {
        "friendshipId": "123e4567-e89b-12d3-a456-426614174000",
        "friend": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://example.com/avatar.jpg",
          "totalScore": 15420,
          "lastActive": "2024-01-16T15:30:00Z"
        },
        "friendsSince": "2024-01-10T08:45:00Z",
        "status": "ACCEPTED"
      }
    ],
    "totalCount": 25
  },
  "pagination": {
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 5. Block/Unblock User

**PUT** `/api/friends/block/:targetUserId`

Blocks or unblocks a user.

#### URL Parameters
- `targetUserId`: UUID of the user to block/unblock

#### Request
```json
{
  "action": "block"  // "block" | "unblock"
}
```

#### Response (200 OK) - Block
```json
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "action": "block",
    "targetUser": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "problematic_user"
    },
    "status": "BLOCKED"
  }
}
```

#### Response (200 OK) - Unblock
```json
{
  "success": true,
  "message": "User unblocked successfully",
  "data": {
    "action": "unblock",
    "targetUser": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "formerly_blocked_user"
    }
  }
}
```

---

### 6. Search Users

**GET** `/api/friends/search?query=john&limit=10&offset=0`

Searches for users by username/name with friendship status context.

#### Query Parameters
- `query` (required): Search term (1-50 characters, alphanumeric + spaces + underscores)
- `limit` (optional): Number of results (default: 10, max: 50)
- `offset` (optional): Number of results to skip (default: 0)

#### Response (200 OK)
```json
{
  "success": true,
  "message": "User search completed successfully",
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar.jpg",
        "totalScore": 15420,
        "friendshipStatus": "NONE"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "username": "johnny_games",
        "firstName": "Johnny",
        "lastName": "Player",
        "avatar": null,
        "totalScore": 8765,
        "friendshipStatus": "PENDING_SENT"
      }
    ],
    "totalCount": 2,
    "query": "john",
    "hasMore": false
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

#### Friendship Status Values
- `NONE` - No relationship
- `PENDING_SENT` - Current user sent friend request
- `PENDING_RECEIVED` - Current user received friend request  
- `ACCEPTED` - Active friendship
- `BLOCKED` - User is blocked

---

### 7. Get User Profile with Friendship Status

**GET** `/api/friends/profile/:userId`

Retrieves another user's public profile with friendship relationship status.

#### URL Parameters
- `userId`: UUID of the user to view

#### Response (200 OK)
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://example.com/avatar.jpg",
      "totalScore": 15420,
      "friendshipStatus": "ACCEPTED"
    }
  }
}
```

---

### 8. Get Friendship Statistics

**GET** `/api/friends/stats`

Retrieves comprehensive friendship statistics for the authenticated user.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Friendship statistics retrieved successfully",
  "data": {
    "totalFriends": 25,
    "pendingSent": 3,
    "pendingReceived": 5,
    "blockedUsers": 2
  }
}
```

---

### 9. Get Friend Activity Status

**GET** `/api/friends/activity?friendIds=uuid1,uuid2`

Retrieves activity status for user's friends (online status, current games).

#### Query Parameters
- `friendIds` (optional): Comma-separated list of friend UUIDs. If not provided, returns all friends.

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Friend activity status retrieved successfully",
  "data": {
    "friends": [
      {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "username": "john_doe",
        "isOnline": true,
        "lastSeen": "2024-01-16T15:30:00Z",
        "currentGame": {
          "gameId": "789e4567-e89b-12d3-a456-426614174999",
          "gameType": "PVP_MATCH",
          "status": "IN_PROGRESS"
        }
      },
      {
        "userId": "660e8400-e29b-41d4-a716-446655440001",
        "username": "jane_smith",
        "isOnline": false,
        "lastSeen": "2024-01-16T12:15:00Z"
      }
    ],
    "summary": {
      "totalFriends": 2,
      "onlineFriends": 1,
      "friendsInGame": 1
    }
  }
}
```

---

