# With-A-Twist Backend API Reference

## API Base URL (Live)
```
https://wat.vcern.com

```

---

## Auth Endpoints: `/api/auth/*`

### POST `/api/auth/signup`
Create a new user and send OTP for email verification.

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "username": "user12345",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Success):**
```json
{
  "message": "Please check your email for the verification code",
  "requiresVerification": true,
  "userId": "user-uuid"
}
```

**Error Response:**
```json
{
  "message": "Input validation failed",
  "errors": ["..."]
}
```

---

### POST `/api/auth/verify-otp`
Complete signup by verifying OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 Success):**
```json
{
  "message": "Email verified successfully!",
  "user": { 
    "id": "user-uuid", 
    "username": "user12345" 
  },
  "token": "jwt-token"
}
```

---

### POST `/api/auth/login`
Authenticate user and return JWT.

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "password123"
}
```

**Response (200 Success):**
```json
{
  "message": "Login successful!",
  "user": { 
    "id": "user-uuid", 
    "username": "user12345" 
  },
  "token": "jwt-token"
}
```

---

## User Endpoints: `/api/user/*` 
**(Require Bearer JWT Authentication)**

### GET `/api/user/profile`
Get current user profile.

**Response (200 Success):**
```json
{
  "message": "User profile retrieved successfully.",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "username": "user12345",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://.../avatars/userid/avatar.jpg",
    "createdAt": "2025-07-22T20:05:22.895Z",
    "updatedAt": "2025-07-22T20:05:22.895Z"
  }
}
```

---

### PUT `/api/user/profile`
Update profile fields (send only what changes).

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "user56789"
}
```

**Response (200 Success):**
```json
{
  "message": "User profile updated successfully.",
  "user": { "...user object..." }
}
```

**Error Response (409 Conflict):**
```json
{
  "message": "Username already exists.",
  "error": "USERNAME_ALREADY_EXISTS"
}
```

---

### DELETE `/api/user/account`
Delete current user account.

**Response (200 Success):**
```json
{
  "message": "User account deleted successfully.",
  "deletedUserId": "user-uuid"
}
```

---

### POST `/api/user/avatar`
Upload avatar image.

**Request:** 
- Content-Type: `multipart/form-data`
- Field name: `avatar`

**Response (200 Success):**
```json
{
  "message": "Avatar uploaded successfully.",
  "avatarUrl": "https://.../avatars/userid/avatar.jpg",
  "user": { "...user object..." }
}
```

---

### DELETE `/api/user/avatar`
Delete user avatar.

**Response (200 Success):**
```json
{
  "message": "Avatar removed successfully.",
  "user": { 
    "...user object...", 
    "avatar": null 
  }
}
```

---

## Authentication

All endpoints under `/api/user/*` require Bearer token authentication:

```
Authorization: Bearer <jwt-token>
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400,
    "timestamp": "2025-08-14T09:00:00.000Z",
    "requestId": "req_unique_id"
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error
