# API Test Cases - Labyrinth Backend

**Test Environment:** http://localhost:3001  
**Created:** December 2, 2025

---

## 🧪 How to Use These Test Cases

1. **Start the server:** `npm run dev`
2. **Use Postman/Thunder Client/curl** to test endpoints
3. **Save tokens** from login/signup for authenticated requests
4. **Follow the order** - Some tests depend on previous ones

---

## Test Case 1: User Registration (Signup)

**Endpoint:** `POST /api/auth/signup`

**Test Data:**
```json
{
  "userEmail": "test@example.com",
  "password": "SecurePass123!",
  "username": "testuser1",
  "firstName": "Test",
  "lastName": "User",
  "dateOfBirth": "1995-05-15",
  "country": "Pakistan",
  "preferredLanguage": "English"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "<uuid>",
      "email": "test@example.com",
      "username": "testuser1",
      "status": "VERIFIED"
    },
    "session": {
      "access_token": "<save-this-token>",
      "refresh_token": "<token>",
      "expires_in": 3600
    }
  },
  "message": "Signup successful! Account auto-verified for development."
}
```

**✅ Pass Criteria:**
- Status 200
- Returns user object with ID
- Returns access_token
- User status is "VERIFIED"

**❌ Failure Cases to Test:**
- Duplicate email (should return 409)
- Duplicate username (should return 409)
- Invalid email format (should return 400)
- Weak password (should return 400)

---

## Test Case 2: User Login

**Endpoint:** `POST /api/auth/login`

**Test Data:**
```json
{
  "emailOrUsername": "testuser1",
  "password": "SecurePass123!"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "username": "testuser1",
    "token": "<save-this-token>"
  },
  "message": "Login successful"
}
```

**✅ Pass Criteria:**
- Status 200
- Returns JWT token
- Token can be used for authenticated requests

**❌ Failure Cases:**
- Wrong password (401)
- Non-existent user (401)
- Missing credentials (400)

---

## Test Case 3: Get Own Profile

**Endpoint:** `GET /api/user/profile`

**Headers:**
```
Authorization: Bearer <token-from-login>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "email": "test@example.com",
    "username": "testuser1",
    "firstName": "Test",
    "lastName": "User",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "lastActive": "<timestamp>",
    "education": null,
    "gitHubProfile": null,
    "createdAt": "<timestamp>",
    "updatedAt": "<timestamp>"
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Returns complete user profile
- Data matches signup data

**❌ Failure Cases:**
- No token (401)
- Invalid token (401)
- Expired token (401)

---

## Test Case 4: Update Profile

**Endpoint:** `PUT /api/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Test Data:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "education": "Bachelor",
  "gitHubProfile": "https://github.com/testuser1"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "user": { "...updated fields..." },
    "updated": true,
    "updatedFields": ["firstName", "lastName", "education", "gitHubProfile"]
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Profile updated successfully
- Returns updated fields list

---

## Test Case 5: Update Demographics

**Endpoint:** `PUT /api/user/demographic`

**Headers:**
```
Authorization: Bearer <token>
```

**Test Data:**
```json
{
  "country": "United States",
  "languages": ["English", "Spanish"]
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "country": "United States",
    "languages": ["English", "Spanish"],
    "updatedAt": "<timestamp>"
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Demographics updated
- Languages array stored correctly

---

## Test Case 6: Get Own Demographics

**Endpoint:** `GET /api/user/demographic`

**Headers:**
```
Authorization: Bearer <token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "country": "United States",
    "languages": ["English", "Spanish"]
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Returns updated demographics

---

## Test Case 7: Forgot Password (OTP via SES)

**Endpoint:** `POST /api/auth/forgot-password`

**Test Data:**
```json
{
  "email": "test@example.com"
}
```

**Expected Response (200):**
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

**✅ Pass Criteria:**
- Status 200
- Check email for OTP (if SES configured)
- OTP should be 6 digits
- Same response for existing/non-existing emails (security)

**📧 Email Check:**
- Check `l217728@lhr.nu.edu.pk` inbox
- Subject: "Reset Your Password - Labyrinth"
- Contains 6-digit OTP
- OTP expires in 2 minutes

---

## Test Case 8: Verify OTP

**Endpoint:** `POST /api/auth/verify-otp-reset`

**Test Data:**
```json
{
  "email": "test@example.com",
  "otp": "<6-digit-code-from-email>"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully. You can now reset your password.",
  "data": {
    "verified": true
  }
}
```

**✅ Pass Criteria:**
- Status 200
- OTP verified
- Ready for password reset

**❌ Failure Cases:**
- Wrong OTP (401)
- Expired OTP (401)
- Already used OTP (401)

---

## Test Case 9: Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Test Data:**
```json
{
  "email": "test@example.com",
  "otp": "<6-digit-code>",
  "newPassword": "NewSecurePass123!"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "passwordReset": true
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Password reset successful
- Can login with new password

---

## Test Case 10: Forgot Username (Email via SES)

**Endpoint:** `POST /api/auth/forgot-username`

**Test Data:**
```json
{
  "email": "test@example.com"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "If an account with this email exists, your username has been sent.",
  "data": {
    "emailSent": true
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Check email for username
- Email contains styled HTML template

**📧 Email Check:**
- Subject: "Your Username Recovery - Labyrinth"
- Contains username in styled box
- Security notice included

---

## Test Case 11: Create Another User (For Chat Testing)

**Endpoint:** `POST /api/auth/signup`

**Test Data:**
```json
{
  "userEmail": "user2@example.com",
  "password": "SecurePass123!",
  "username": "testuser2",
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1996-08-20",
  "country": "Pakistan",
  "preferredLanguage": "Urdu"
}
```

**✅ Pass Criteria:**
- Create second user successfully
- Save second user's token
- Use for chat testing

---

## Test Case 12: Create Direct Chat

**Endpoint:** `POST /api/chat/direct`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Test Data:**
```json
{
  "otherUserId": "<user2-id>"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<chat-uuid>",
    "type": "DIRECT",
    "participants": [
      { "userId": "<user1-id>", "user": {...} },
      { "userId": "<user2-id>", "user": {...} }
    ],
    "messages": [],
    "createdAt": "<timestamp>"
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Chat created with 2 participants
- Returns chat ID
- Save chat ID for next tests

---

## Test Case 13: Send Message

**Endpoint:** `POST /api/chat/<chat-id>/message`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Test Data:**
```json
{
  "content": "Hello! This is a test message.",
  "messageType": "TEXT"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<message-uuid>",
    "content": "Hello! This is a test message.",
    "messageType": "TEXT",
    "senderId": "<user1-id>",
    "chatId": "<chat-id>",
    "sender": {
      "id": "<user1-id>",
      "username": "testuser1",
      "firstName": "Test",
      "lastName": "User"
    },
    "createdAt": "<timestamp>"
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Message sent
- Real-time broadcast via Pusher (check console if Pusher client connected)

---

## Test Case 14: Get Chat Messages

**Endpoint:** `GET /api/chat/<chat-id>/messages?page=1&limit=50`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "<message-uuid>",
        "content": "Hello! This is a test message.",
        "messageType": "TEXT",
        "senderId": "<user1-id>",
        "sender": {...},
        "createdAt": "<timestamp>"
      }
    ],
    "totalCount": 1,
    "hasMore": false
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Returns message sent in Test Case 13
- Messages in chronological order

---

## Test Case 15: Set Typing Indicator

**Endpoint:** `POST /api/chat/<chat-id>/typing`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Test Data:**
```json
{
  "isTyping": true
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Typing indicator set"
}
```

**✅ Pass Criteria:**
- Status 200
- Pusher broadcasts typing event

---

## Test Case 16: Get My Chats

**Endpoint:** `GET /api/chat/my-chats`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "<chat-id>",
      "type": "DIRECT",
      "name": null,
      "lastMessageAt": "<timestamp>",
      "unreadCount": 0,
      "lastMessage": {
        "id": "<message-id>",
        "content": "Hello! This is a test message.",
        "messageType": "TEXT",
        "sender": {...}
      },
      "otherParticipants": [...]
    }
  ]
}
```

**✅ Pass Criteria:**
- Status 200
- Returns chat created in Test Case 12
- Shows last message

---

## Test Case 17: Get User Recommendations

**Endpoint:** `GET /api/matchmaking/recommendations?limit=10`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "<user2-id>",
      "username": "testuser2",
      "firstName": "Jane",
      "lastName": "Doe",
      "compatibilityScore": 65.5,
      "techStack": {...},
      "demographic": {...},
      "lastActive": "<timestamp>"
    }
  ]
}
```

**✅ Pass Criteria:**
- Status 200
- Returns user2 (if compatibility > 30%)
- Sorted by compatibility score
- Cached for 1 hour

---

## Test Case 18: Swipe Right on User

**Endpoint:** `POST /api/matchmaking/swipe`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Test Data:**
```json
{
  "swipeeUserId": "<user2-id>",
  "direction": "RIGHT"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "swipe": {
      "id": "<swipe-uuid>",
      "swiperUserId": "<user1-id>",
      "swipeeUserId": "<user2-id>",
      "direction": "RIGHT"
    },
    "matched": false
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Swipe recorded
- If user2 also swiped right, `matched: true` and `match` object returned

---

## Test Case 19: Get My Matches

**Endpoint:** `GET /api/matchmaking/matches`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": []
}
```

**✅ Pass Criteria:**
- Status 200
- Returns empty array (no mutual match yet)
- If user2 swiped right, returns match object

---

## Test Case 20: Create Project

**Endpoint:** `POST /api/projects`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Test Data:**
```json
{
  "title": "Test Project",
  "description": "A test project for API testing",
  "workspaceName": "Test Workspace",
  "workspaceDescription": "Workspace for testing"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<project-uuid>",
    "title": "Test Project",
    "description": "A test project for API testing",
    "workspace": {...},
    "collaborators": [...],
    "tasks": [],
    "createdAt": "<timestamp>"
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Project created
- Creator is collaborator
- Workspace created
- Save project ID

---

## Test Case 21: Get Project Details

**Endpoint:** `GET /api/projects/<project-id>`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<project-id>",
    "title": "Test Project",
    "collaborators": [...],
    "tasks": [],
    "_count": {
      "collaborators": 1,
      "tasks": 0
    }
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Returns project details
- Cached for 10 minutes

---

## Test Case 22: Search Projects

**Endpoint:** `GET /api/projects/search?q=test`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "<project-id>",
      "title": "Test Project",
      "description": "A test project for API testing",
      "collaboratorsCount": 1,
      "tasksCount": 0
    }
  ]
}
```

**✅ Pass Criteria:**
- Status 200
- Returns projects matching "test"

---

## Test Case 23: Set User Online

**Endpoint:** `POST /api/presence/online`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Test Data:**
```json
{
  "platform": "web",
  "source": "manual"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User marked as online"
}
```

**✅ Pass Criteria:**
- Status 200
- User marked online in Redis

---

## Test Case 24: Get User Presence

**Endpoint:** `GET /api/presence/<user2-id>`

**Headers:**
```
Authorization: Bearer <user1-token>
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "<user2-id>",
    "status": "offline",
    "lastSeen": "<timestamp>",
    "platform": null
  }
}
```

**✅ Pass Criteria:**
- Status 200
- Returns presence data

---

## 🎯 Test Summary Checklist

### Authentication ✅
- [x] Signup (Test Case 1)
- [x] Login (Test Case 2)
- [x] Forgot Password (Test Case 7)
- [x] Verify OTP (Test Case 8)
- [x] Reset Password (Test Case 9)
- [x] Forgot Username (Test Case 10)

### User Profile ✅
- [x] Get Own Profile (Test Case 3)
- [x] Update Profile (Test Case 4)
- [x] Update Demographics (Test Case 5)
- [x] Get Demographics (Test Case 6)

### Chat & Messaging ✅
- [x] Create Direct Chat (Test Case 12)
- [x] Send Message (Test Case 13)
- [x] Get Messages (Test Case 14)
- [x] Typing Indicator (Test Case 15)
- [x] Get My Chats (Test Case 16)

### Matchmaking ✅
- [x] Get Recommendations (Test Case 17)
- [x] Swipe on User (Test Case 18)
- [x] Get Matches (Test Case 19)

### Projects ✅
- [x] Create Project (Test Case 20)
- [x] Get Project Details (Test Case 21)
- [x] Search Projects (Test Case 22)

### Presence ✅
- [x] Set Online (Test Case 23)
- [x] Get Presence (Test Case 24)

---

## 📧 Email Testing (Amazon SES)

### Prerequisites:
1. **Verify email** in AWS SES Console: `l217728@lhr.nu.edu.pk`
2. **Sandbox mode:** Can only send to verified emails
3. **Production:** Move out of sandbox to send to any email

### Expected Emails:

#### 1. Password Reset OTP
- **Subject:** "Reset Your Password - Labyrinth"
- **Contains:** 6-digit OTP code
- **Expires:** 2 minutes
- **Template:** Styled HTML with OTP in large font

#### 2. Username Recovery
- **Subject:** "Your Username Recovery - Labyrinth"
- **Contains:** Username in styled box
- **Template:** Professional HTML with security notice

### Test Email Delivery:
```bash
# Test forgot password (OTP should be sent)
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Check email inbox for OTP
# Then verify OTP
curl -X POST http://localhost:3001/api/auth/verify-otp-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'
```

---

## 🔍 Important Notes

### Supabase + SES Connection
**Q: "Is Supabase connected to SES?"**

**A:** No direct connection needed! Here's how it works:

1. **Supabase** handles:
   - User authentication (JWT tokens)
   - Database (PostgreSQL)
   - Auto-verification in development

2. **Amazon SES** handles:
   - Password reset OTP emails
   - Username recovery emails
   - Independent from Supabase

3. **Email Flow:**
   ```
   User requests password reset
   → Backend generates OTP
   → Backend sends email via SES (nodemailer)
   → User receives OTP
   → User verifies OTP
   → Backend updates password in Supabase
   ```

**They work independently but together!**

---

## 🚨 Common Issues & Solutions

### Issue 1: "Email not received"
**Solution:**
- Check AWS SES sandbox mode
- Verify sender email in SES Console
- Check spam folder
- Verify recipient email

### Issue 2: "401 Unauthorized"
**Solution:**
- Check if token is included in header
- Token format: `Bearer <token>`
- Token might be expired (login again)

### Issue 3: "Chat not found"
**Solution:**
- Ensure chat ID is correct
- User must be participant in chat
- Create chat first (Test Case 12)

### Issue 4: "Pusher not broadcasting"
**Solution:**
- Check Pusher credentials in .env
- Verify Pusher client is subscribed to channel
- Check browser console for Pusher events

---

## 📊 Performance Testing

### Cache Testing
```bash
# First request (uncached)
time curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <token>"

# Second request (cached - should be faster)
time curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <token>"
```

### Expected Results:
- First request: ~200ms
- Cached request: ~50ms
- Cache hit rate: ~80%

---

## ✅ Test Results Template

Use this to track your test results:

| Test Case | Status | Response Time | Notes |
|-----------|--------|---------------|-------|
| TC1: Signup | ✅ | 250ms | User created successfully |
| TC2: Login | ✅ | 180ms | Token received |
| TC3: Get Profile | ✅ | 45ms | Cached response |
| TC7: Forgot Password | ⚠️ | 300ms | Email sent (check inbox) |
| TC12: Create Chat | ✅ | 220ms | Chat ID: xyz |
| TC13: Send Message | ✅ | 150ms | Pusher working |
| ... | ... | ... | ... |

---

**Last Updated:** December 2, 2025  
**Total Test Cases:** 24  
**Coverage:** Authentication, Profile, Chat, Matchmaking, Projects, Presence
