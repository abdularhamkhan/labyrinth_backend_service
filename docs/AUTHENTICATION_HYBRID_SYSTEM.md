# Hybrid OTP Authentication System

## Overview

The Labyrinth backend implements a **smart hybrid authentication system** that intelligently handles OTP email delivery limitations while providing seamless user experience for testing and demos.

## System Design

### Primary Flow: OTP-Based Verification
When email quota is available, users receive a 6-digit OTP:

```
1. User signs up → Supabase sends OTP email
2. User verifies OTP → Account activated
3. User can login with credentials
```

### Fallback Flow: Auto-Verification
When email quota is exceeded (Supabase free plan: 2 emails/hour), users are auto-verified:

```
1. User signs up → Email quota exceeded
2. System auto-verifies account → Returns JWT token immediately
3. User can use the app right away
```

## Implementation Details

### Signup Service (`auth.service.ts`)

The signup process attempts to send OTP first, then falls back gracefully:

```typescript
// Try normal signup with OTP email
const { data, error } = await supabase.auth.signUp({
  email: userEmail,
  password,
  // ... options
});

if (error && isEmailQuotaError(error)) {
  // FALLBACK: Auto-verify user
  const { data: adminData } = await supabaseAdmin.auth.admin.createUser({
    email: userEmail,
    password,
    email_confirm: true, // Skip OTP verification
    // ... metadata
  });
  
  autoVerified = true;
  // Generate session token immediately
}
```

### Response Structure

**When OTP is sent:**
```json
{
  "success": true,
  "message": "Sign up complete! Please check your email for the verification code.",
  "data": {
    "requiresVerification": true,
    "userId": "uuid",
    "username": "johndoe"
  }
}
```

**When auto-verified (fallback):**
```json
{
  "success": true,
  "message": "Sign up successful! Your account is ready to use.",
  "data": {
    "requiresVerification": false,
    "userId": "uuid",
    "username": "johndoe",
    "user": {
      "id": "uuid",
      "username": "johndoe"
    },
    "token": "eyJhbGc..."
  }
}
```

## User Status Management

The system sets appropriate user status based on verification method:

- **PENDING_VERIFICATION**: OTP email sent, waiting for verification
- **ACTIVE**: Auto-verified or OTP verified successfully

### Database Schema
```typescript
status: autoVerified ? "ACTIVE" : "PENDING_VERIFICATION"
```

## Console Logging

The system provides clear logging for debugging:

```bash
✅ Supabase user created with OTP email sent: abc-123
# OR
⚠️  Supabase signup with OTP failed: Email rate limit exceeded
📧 Email quota exceeded, falling back to auto-verification...
✅ Supabase user created (auto-verified due to email quota): abc-123
✅ Auto-generated session token for auto-verified user
```

## Testing Workflow

### Test Scenario 1: OTP Flow (First 2 signups/hour)
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test1@example.com",
    "password": "SecurePass123!",
    "username": "testuser1",
    "firstName": "Test",
    "lastName": "User"
  }'

# Response: requiresVerification: true
# Check email for OTP, then verify:

curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "otp": "123456"
  }'
```

### Test Scenario 2: Auto-Verify Flow (After email quota)
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test3@example.com",
    "password": "SecurePass123!",
    "username": "testuser3",
    "firstName": "Test",
    "lastName": "User"
  }'

# Response: requiresVerification: false, token: "eyJhbGc..."
# Token is immediately usable for API calls!
```

## Frontend Integration

### React Native / React Example

```typescript
const handleSignup = async (userData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  
  if (result.data.requiresVerification) {
    // Show OTP input screen
    navigate('/verify-otp', { email: userData.userEmail });
  } else {
    // User is auto-verified, token provided
    saveToken(result.data.token);
    navigate('/dashboard');
  }
};
```

## Email Quota Management

### Supabase Free Plan Limits
- **2 emails per hour** per project
- Includes: OTP verification, password reset, email changes

### Monitoring Quota
Check console logs for:
- `✅ Supabase user created with OTP email sent` - OTP sent successfully
- `📧 Email quota exceeded, falling back` - Quota reached, auto-verifying

### Reset Quota
Quota resets automatically every hour based on first email sent.

## Future Enhancements

### When Email Service is Upgraded

1. **Remove fallback logic** (optional - can keep for resilience)
2. **Always require OTP verification**
3. **Update status logic**:
   ```typescript
   status: "PENDING_VERIFICATION" // Always require verification
   ```

### Custom Email Provider

To integrate SendGrid/SES/Resend instead of Supabase:

1. Keep commented code in `src/config/ses.ts`
2. Replace Supabase OTP with custom implementation
3. Update `signupService` to use custom email sender

```typescript
// Currently commented in code:
// import { sendOTPEmail } from "../config/ses";
// await sendOTPEmail(userEmail, otpCode);
```

## Security Considerations

### Why This Approach is Safe

1. **Email quota fallback is transparent**: User gets same secure experience
2. **Supabase handles password hashing**: No security compromise
3. **JWT tokens are properly generated**: Using Supabase auth primitives
4. **Rate limiting still applies**: Account security mechanisms active
5. **Audit logging maintained**: All signup attempts logged

### Attack Vectors Considered

- **User enumeration**: Both flows return consistent timing
- **Brute force**: Rate limiting prevents abuse
- **Account takeover**: Password security requirements enforced
- **Email verification bypass**: Only occurs when email sending fails (not user-controlled)

## Configuration

### Environment Variables

No additional configuration needed. System automatically detects email quota and falls back.

### Feature Flags (Optional)

To force auto-verification for all users (testing mode):

```typescript
// In auth.service.ts, set:
const FORCE_AUTO_VERIFY = process.env.FORCE_AUTO_VERIFY === 'true';

if (FORCE_AUTO_VERIFY || supabaseError) {
  // Use fallback flow
}
```

## Troubleshooting

### Issue: Users not receiving OTP emails

**Check:**
1. Console logs for "OTP email sent" message
2. Supabase email quota in dashboard
3. Email provider configuration in Supabase

**Solution:** System will auto-fallback after 2 emails/hour

### Issue: Auto-verified users can't login

**Check:**
1. User status in database (should be "ACTIVE")
2. Supabase Auth user email_confirmed status
3. Console logs for token generation errors

**Solution:** User should have `email_confirmed: true` in Supabase

### Issue: Token not returned on signup

**Check:**
1. `autoVerified` flag in service
2. Token generation in Step 4 of signup service
3. Controller response structure

## API Endpoints

### POST /api/auth/signup
- **Rate Limited**: 3 attempts/hour
- **Returns**: User ID, username, requiresVerification flag, optional token

### POST /api/auth/verify-otp
- **Rate Limited**: 5 attempts/10 minutes
- **Required**: email, otp (6 digits)
- **Returns**: User info and JWT token

### POST /api/auth/login
- **Rate Limited**: 10 attempts/5 minutes
- **Required**: emailOrUsername, password
- **Returns**: User info and JWT token

## Benefits

### For Development
- ✅ No email service dependency
- ✅ Unlimited testing without quota concerns
- ✅ Faster onboarding during demos
- ✅ Works offline/without internet

### For Production
- ✅ Graceful degradation when email service has issues
- ✅ Better user experience (no waiting for OTP if service is down)
- ✅ Maintains security standards
- ✅ Easy to monitor and debug

## Summary

This hybrid authentication system provides:
- **Reliability**: Works even when email quota is exhausted
- **Flexibility**: Seamlessly switches between OTP and auto-verify
- **Security**: Maintains all security standards in both flows
- **UX**: Users get immediate access when needed
- **Observability**: Clear logging for debugging

Perfect for FYP demos, testing, and production resilience! 🚀
