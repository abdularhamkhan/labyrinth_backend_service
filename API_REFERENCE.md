# 🚀 **User Presence API Reference**

**Implementation: Hybrid Smart Pagination Approach (Recommended)**

This API implements enterprise-grade user presence tracking with Redis-based real-time status management and PostgreSQL data persistence.

---

## 🔒 **Authentication Required**

All endpoints require Bearer token authentication:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📚 **Table of Contents**

1. [Authentication Endpoints](#authentication-endpoints)
2. [Main Endpoints (Hybrid Smart Pagination)](#main-endpoints)
3. [Specialized Endpoints](#specialized-endpoints)
4. [Request/Response Examples](#examples)
5. [Rate Limits](#rate-limits)
6. [Error Handling](#error-handling)
7. [Testing Guide](#testing-guide)

---

## 🔐 **Authentication Endpoints**

These endpoints handle user authentication and account management. They do not require authentication tokens.

### **1. User Registration**
Registers a new user account and sends OTP verification.

```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "username": "john_doe",
  "password": "StrongPass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890" // optional
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "user@example.com",
    "username": "john_doe",
    "password": "StrongPass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Sign up complete. Please verify your email via OTP sent to you.",
  "data": {
    "requiresVerification": true,
    "userId": "uuid"
  }
}
```

### **2. Email Verification**
Verifies user email using OTP and returns JWT token.

```http
POST /api/auth/verify-otp
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe"
    },
    "token": "jwt_token_here"
  }
}
```

### **3. User Login**
Authenticates user with email/username and password.

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "StrongPass123!"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "user@example.com",
    "password": "StrongPass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe"
    },
    "token": "jwt_token_here"
  }
}
```

### **4. Forgot Password**
Initiates password reset process by sending reset email.

```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with this email exists, a password reset link will be sent.",
  "data": {
    "emailSent": true
  }
}
```

**Security Note:** The response is intentionally vague to prevent user enumeration attacks.

### **5. Reset Password**
Completes password reset using secure token from email.

```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "secure_reset_token_from_email",
  "password": "NewStrongPass123!"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "secure_reset_token_from_email",
    "password": "NewStrongPass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been successfully reset. Please log in with your new password.",
  "data": {
    "passwordReset": true,
    "userId": "uuid"
  }
}
```

**Security Features:**
- Tokens expire after 1 hour
- Single-use tokens (cannot be reused)
- All user sessions are invalidated after password reset
- Secure token generation using cryptographically strong methods

---

## 🎯 **Main Endpoints (Hybrid Smart Pagination)**

### **1. Get Users - Unified Endpoint**
**The primary endpoint implementing your preferred approach**

```http
GET /api/users
```

#### **Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `status` | `"online"` \| `"offline"` | `"online"` | - | Filter by user status |
| `page` | `number` | `1` | - | Page number |
| `limit` | `number` | `50` | `100` | Results per page |
| `include` | `"stats"` | `false` | - | Include game statistics |
| `hours_back` | `number` | `24` | `168` | For offline users, hours to look back |

#### **Examples:**

**Get Online Users with Stats:**
```bash
curl -X GET "http://localhost:3000/api/users?status=online&page=1&limit=50&include=stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Offline Users (last 24 hours):**
```bash
curl -X GET "http://localhost:3000/api/users?status=offline&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get All Users (defaults to online):**
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Offline Users (last week):**
```bash
curl -X GET "http://localhost:3000/api/users?status=offline&page=1&limit=50&hours_back=168" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Response Format:**
```json
{
  "success": true,
  "message": "Online users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "uuid",
        "username": "player1",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://...",
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

---

## ⚡ **Specialized Endpoints**

### **2. Get Online Count (Lightweight)**
Fast endpoint for dashboards and real-time displays.

```http
GET /api/users/online/count
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/users/online/count" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
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

### **3. Update Heartbeat (Keep Alive)**
Clients should call this every 2 minutes to maintain online status.

```http
POST /api/users/heartbeat
```

**Body (optional):**
```json
{
  "device_info": {
    "platform": "mobile",
    "version": "1.0.5",
    "os": "iOS 17.2"
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/users/heartbeat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"device_info": {"platform": "mobile", "version": "1.0"}}'
```

**Response:**
```json
{
  "success": true,
  "message": "Heartbeat updated successfully",
  "data": {
    "userId": "uuid",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### **4. Get My Presence Status**
Returns current user's presence information.

```http
GET /api/users/me/presence
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/users/me/presence" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "User presence retrieved successfully",
  "data": {
    "presence": {
      "userId": "uuid",
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

### **5. Get Presence Statistics (Analytics)**
Returns platform-wide presence statistics for admin dashboards.

```http
GET /api/users/presence/stats
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/users/presence/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
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

---

## 🚦 **Rate Limits**

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| `GET /api/users` | 60 requests | 1 minute |
| `GET /api/users/online/count` | 120 requests | 1 minute |
| `POST /api/users/heartbeat` | 60 requests | 1 minute |
| `GET /api/users/me/presence` | 120 requests | 1 minute |
| `GET /api/users/presence/stats` | 30 requests | 1 minute |

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: Time when rate limit resets

---

## ❌ **Error Handling**

### **Standard Error Response:**
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)"
}
```

### **Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid token)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### **Example Error Responses:**

**Rate Limit Exceeded:**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

**Invalid Parameters:**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid query parameters: status must be either 'online' or 'offline'"
}
```

---

## 🧪 **Testing Guide**

### **Prerequisites:**
1. Server running on `http://localhost:3000`
2. Valid JWT token from authentication
3. Redis server running
4. PostgreSQL database connected

### **Step-by-Step Testing:**

#### **1. Test Online Users (Main Endpoint):**
```bash
# Basic request
curl -X GET "http://localhost:3000/api/users?status=online" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With pagination and stats
curl -X GET "http://localhost:3000/api/users?status=online&page=1&limit=10&include=stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **2. Test Offline Users:**
```bash
curl -X GET "http://localhost:3000/api/users?status=offline&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **3. Test Heartbeat (to appear online):**
```bash
curl -X POST "http://localhost:3000/api/users/heartbeat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### **4. Test Online Count:**
```bash
curl -X GET "http://localhost:3000/api/users/online/count" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **5. Test My Presence:**
```bash
curl -X GET "http://localhost:3000/api/users/me/presence" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **6. Test Presence Stats:**
```bash
curl -X GET "http://localhost:3000/api/users/presence/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **7. Test Password Reset (Forgot Password):**
```bash
curl -X POST "http://localhost:3000/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### **8. Test Password Reset (Reset with Token):**
```bash
curl -X POST "http://localhost:3000/api/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{"token": "your_reset_token_here", "password": "NewPassword123!"}'
```

### **Advanced Testing with Multiple Users:**

#### **Simulate Multiple Online Users:**
1. Get JWT tokens for different users
2. Call heartbeat for each user:
```bash
# User 1
curl -X POST "http://localhost:3000/api/users/heartbeat" \
  -H "Authorization: Bearer USER1_JWT_TOKEN"

# User 2
curl -X POST "http://localhost:3000/api/users/heartbeat" \
  -H "Authorization: Bearer USER2_JWT_TOKEN"
```
3. Check online users:
```bash
curl -X GET "http://localhost:3000/api/users?status=online" \
  -H "Authorization: Bearer ANY_JWT_TOKEN"
```

### **Testing Rate Limits:**
```bash
# Run this command quickly multiple times to trigger rate limit
for i in {1..65}; do
  curl -X GET "http://localhost:3000/api/users/online/count" \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
done
```

### **Testing Invalid Parameters:**
```bash
# Invalid status
curl -X GET "http://localhost:3000/api/users?status=invalid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Invalid pagination
curl -X GET "http://localhost:3000/api/users?page=-1&limit=500" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔧 **Environment Setup for Testing**

### **1. Environment Variables:**
Ensure these are set in your `.env` file:
```env
DATABASE_URL=your_postgresql_connection_string
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
PORT=3000
```

### **2. Start Services:**
```bash
# Start Redis (if not running)
redis-server

# Start PostgreSQL (if not running)
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql  # Linux

# Start your application
npm run dev
```

### **3. Get JWT Token:**
First authenticate to get a JWT token:
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

Copy the JWT token from the response and use it in the `Authorization` header for all presence endpoint tests.

---

## 📊 **Performance Considerations**

- **Online Users**: Redis-based lookup (extremely fast)
- **Offline Users**: Database query with indexing (optimized)
- **Pagination**: Efficient cursor-based pagination
- **Caching**: Redis TTL-based automatic cleanup
- **Rate Limiting**: Per-endpoint optimized limits

---

## 🎯 **Architecture Highlights**

✅ **Scalability**: Handles millions of users via pagination  
✅ **Performance**: Redis + Database hybrid approach  
✅ **Security**: Rate-limited, authenticated, role-based access  
✅ **Efficiency**: Smart caching + selective field loading  
✅ **Reliability**: TTL-based cleanup + heartbeat mechanism  
✅ **Maintainability**: Clean separation of concerns  

---

## 📞 **Support**

For questions or issues with these endpoints:
1. Check server logs for detailed error information
2. Verify Redis and PostgreSQL connections
3. Confirm JWT token validity
4. Test with provided curl examples

**Happy Testing! 🚀**
