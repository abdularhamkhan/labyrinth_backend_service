# Leaderboard API Reference

## API Base URL
```
https://wat.vcern.com
```

---

## Public Endpoints (No Authentication Required)

### GET `/api/app/leaderboard/global`
Retrieves the global leaderboard with top players and their scores.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of results to return (1-100) |
| `offset` | number | 0 | Number of results to skip |

**Example Request:**
```bash
GET https://wat.vcern.com/api/app/leaderboard/global?limit=20&offset=0
```

**Response (200 Success):**
```json
{
  "success": true,
  "message": "Global leaderboard retrieved successfully",
  "data": {
    "players": [
      {
        "id": "user-uuid",
        "username": "player123",
        "firstName": "John",
        "lastName": "Doe", 
        "avatar": "https://.../avatar.jpg",
        "totalScore": 15000,
        "gamesPlayed": 45,
        "gamesWon": 32,
        "winRate": 71.11,
        "rank": 1
      }
    ],
    "totalPlayers": 1250,
    "fromCache": true,
    "lastUpdated": "2025-08-14T09:00:00.000Z"
  }
}
```

---

### GET `/api/app/leaderboard/weekly`
Retrieves the weekly leaderboard for the current week (resets every Monday at midnight UTC).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of results to return (1-100) |
| `offset` | number | 0 | Number of results to skip |

**Example Request:**
```bash
GET https://wat.vcern.com/api/app/leaderboard/weekly?limit=15
```

**Response (200 Success):**
```json
{
  "success": true,
  "message": "Weekly leaderboard retrieved successfully",
  "data": {
    "players": [],
    "totalPlayers": 0,
    "fromCache": false,
    "lastUpdated": "2025-08-14T09:00:00.000Z",
    "weekStart": "2025-08-11T00:00:00.000Z",
    "weekEnd": "2025-08-17T23:59:59.999Z"
  }
}
```

---

### GET `/api/app/leaderboard/daily`
Retrieves the daily leaderboard for today (resets every day at midnight UTC).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of results to return (1-100) |
| `offset` | number | 0 | Number of results to skip |

**Example Request:**
```bash
GET https://wat.vcern.com/api/app/leaderboard/daily?limit=10&offset=5
```

**Response (200 Success):**
```json
{
  "success": true,
  "message": "Daily leaderboard retrieved successfully",
  "data": {
    "players": [],
    "totalPlayers": 0,
    "fromCache": false,
    "lastUpdated": "2025-08-14T09:00:00.000Z",
    "date": "2025-08-14"
  }
}
```

---

## Protected Endpoints (Require Authentication)

### GET `/api/app/leaderboard/rank/:type`
Retrieves the current user's rank in the specified leaderboard type.

**Authentication:** Required (Bearer JWT)

**Path Parameters:**
| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `type` | string | `global`, `weekly`, `daily` | Leaderboard type |

**Example Request:**
```bash
GET https://wat.vcern.com/api/app/leaderboard/rank/global
Authorization: Bearer <jwt-token>
```

**Response (200 Success):**
```json
{
  "success": true,
  "message": "User rank retrieved successfully",
  "data": {
    "userId": "user-uuid",
    "username": "player123",
    "totalScore": 8500,
    "rank": 25,
    "type": "global",
    "outOf": 1250,
    "percentile": 98.0
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Access denied. No token provided or invalid format.",
  "error": "MISSING_OR_INVALID_AUTH_HEADER",
  "expected": "Authorization: Bearer <jwt_token>"
}
```

---

### POST `/api/app/leaderboard/rebuild/:type`
Rebuilds the leaderboard cache from the database. Admin-only endpoint for maintenance.

**Authentication:** Required (Bearer JWT + Admin Role)

**Path Parameters:**
| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `type` | string | `global`, `weekly`, `daily` | Leaderboard type to rebuild |

**Example Request:**
```bash
POST https://wat.vcern.com/api/app/leaderboard/rebuild/global
Authorization: Bearer <admin-jwt-token>
```

**Response (200 Success):**
```json
{
  "success": true,
  "message": "Global leaderboard rebuilt successfully",
  "data": {
    "type": "global",
    "playersProcessed": 1250,
    "cacheCleared": true,
    "rebuildTime": "2025-08-14T09:00:00.000Z",
    "duration": "1.2s"
  }
}
```

---

## Player Object Structure

Each player object in leaderboard responses contains:

```json
{
  "id": "user-uuid",
  "username": "player123",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://example.com/avatars/avatar.jpg",
  "totalScore": 15000,
  "gamesPlayed": 45,
  "gamesWon": 32,
  "winRate": 71.11,
  "rank": 1,
  "lastActive": "2025-08-14T08:30:00.000Z"
}
```

---

## Query Parameter Validation

### Limit Parameter
- **Type:** Number (converted from string)
- **Range:** 1-100
- **Default:** 10
- **Error:** Returns validation error if outside range

### Offset Parameter  
- **Type:** Number (converted from string)
- **Range:** >= 0
- **Default:** 0
- **Error:** Returns validation error if negative

---

## Caching

- **Redis Caching:** All leaderboard data is cached using Redis sorted sets
- **Cache Keys:** 
  - `leaderboard:global`
  - `leaderboard:weekly`
  - `leaderboard:daily`
- **Performance:** Sub-millisecond response times for cached data
- **Cache Invalidation:** Automatic on score updates

---

## Reset Schedule

| Leaderboard Type | Reset Frequency | Reset Time |
|------------------|----------------|------------|
| **Global** | Never | - |
| **Weekly** | Every Monday | 00:00 UTC |
| **Daily** | Every Day | 00:00 UTC |

---

## Status Codes

- `200` - Success
- `400` - Bad Request (invalid query parameters)
- `401` - Unauthorized (missing/invalid JWT token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (invalid leaderboard type)
- `422` - Validation Error (invalid input data)
- `500` - Internal Server Error

---

## Testing

All **public endpoints work** without authentication:
✅ `/api/app/leaderboard/global`
✅ `/api/app/leaderboard/weekly` 
✅ `/api/app/leaderboard/daily`

**Protected endpoints require authentication:**
🔐 `/api/app/leaderboard/rank/:type` (requires valid JWT)

