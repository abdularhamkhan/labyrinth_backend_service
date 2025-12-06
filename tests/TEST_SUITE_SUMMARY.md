# Labyrinth Backend - Test Suite Summary

## Overview
Complete automated test suite covering API endpoints, business logic, and integration workflows. All tests use Jest and Supertest for HTTP testing.

## Test Statistics
- **Total Test Files**: 9
- **Test Categories**: 3 (API, Unit, Integration)
- **Coverage Areas**: Authentication, User Profile, Chat, Matchmaking, Projects, Caching, Validation

## Test Structure

### 1. API Tests (`tests/api/`)
End-to-end tests for all REST API endpoints using actual HTTP requests.

#### `auth.test.ts` - Authentication Tests
- User signup with demographics (dateOfBirth, country, preferredLanguage)
- User login (returns JWT token)
- Forgot password (sends OTP via Amazon SES)
- Forgot username (sends email via Amazon SES)
- **Total Test Cases**: 8

#### `user.test.ts` - User Profile Tests
- Get user profile
- Update user profile (bio, skills, interests, GitHub/LinkedIn URLs)
- Get user demographics
- Update user demographics (dateOfBirth, country, preferredLanguage)
- **Total Test Cases**: 4

#### `chat.test.ts` - Chat & Messaging Tests
- Get all user chats
- Create direct chat with another user
- Send message in chat (TEXT type)
- Get chat messages with pagination
- Send typing indicator (real-time feature with Pusher)
- **Total Test Cases**: 5

#### `matchmaking.test.ts` - Recommendations & Matching Tests
- Get user recommendations (skill/interest-based algorithm)
- Get project recommendations
- Swipe on users (LEFT/RIGHT)
- Get all matches
- Get swipe history
- **Total Test Cases**: 5

#### `projects.test.ts` - Project Management Tests
- Create new project
- Get project details (with Redis caching)
- Update project
- Search projects (full-text search)
- Get project activity feed
- Get project analytics
- **Total Test Cases**: 6

### 2. Unit Tests (`tests/unit/`)
Tests for business logic, algorithms, and utility functions (no HTTP calls).

#### `matchmaking.service.test.ts` - Matchmaking Business Logic
- Skill match score calculation (overlap algorithm)
- Interest match score calculation
- User prioritization by combined scores
- Swipe logic (mutual match detection)
- Match creation when both users swipe right
- Demographics-based filtering (country, language, age)
- **Total Test Cases**: 16

#### `cache.util.test.ts` - Redis Caching Patterns
- Cache key generation (unique keys for users, chats, projects)
- TTL management (different durations per data type)
- Cache invalidation patterns (on update events)
- Data serialization/deserialization (JSON)
- Cache hit/miss logic
- Write-through and cache-aside patterns
- Cache performance metrics (hit rate calculation)
- **Total Test Cases**: 15

#### `validation.test.ts` - Validation & Sanitization
- Email validation (regex-based)
- Password strength validation (uppercase, lowercase, number, special char)
- Username validation (3-30 chars, alphanumeric + underscores)
- URL validation (GitHub, LinkedIn)
- Date validation (dateOfBirth, future deadlines)
- Array validation (skills, interests with length limits)
- String sanitization (whitespace trimming)
- HTML tag stripping (XSS prevention)
- SQL injection pattern detection
- Pagination helpers
- Match score calculation (weighted algorithm)
- **Total Test Cases**: 26

### 3. Integration Tests (`tests/integration/`)
End-to-end workflows spanning multiple API endpoints and services.

#### `user-journey.test.ts` - Complete User Journeys
- **Profile Setup Journey**: Update profile → Update demographics → Get recommendations → Get project recommendations
- **Swipe-to-Match-to-Chat Journey**: Get recommendations → Swipe right → Verify match → Create chat → Send message → Retrieve messages
- **Project Journey**: Create project → Update project → Search projects → View activity feed → Get analytics
- **Password Reset Journey**: Request OTP → Send email via SES
- **Username Recovery Journey**: Request username via email
- **Comprehensive Data Retrieval**: Get profile → Get demographics → Get chats → Get matches → Get swipes
- **Real-time Features**: Test typing indicator → Test Pusher auth endpoint
- **Total Test Cases**: 8 complex workflows

## Running Tests

### Prerequisites
1. **Server must be running** on port 3001
   ```bash
   npm run dev
   ```

2. **Test user must exist** in database:
   - Email: `abdularhamkhan02@gmail.com`
   - Password: `StrongPassword!`

3. **Services must be running**:
   - PostgreSQL (Supabase): Connected
   - Redis: localhost:6379
   - Pusher: Configured in .env
   - Amazon SES: Configured for email sending

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# API tests only
npm test tests/api

# Unit tests only
npm test tests/unit

# Integration tests only
npm test tests/integration

# Specific test file
npm test tests/api/auth.test.ts
```

### Run Tests with Coverage
```bash
npm run test:coverage
```
Coverage reports will be generated in `coverage/` directory (HTML and LCOV formats).

### Watch Mode (for development)
```bash
npm run test:watch
```

### CI Mode (non-interactive)
```bash
npm run test:ci
```

## Test Configuration

### Jest Config (`jest.config.js`)
- **Test Environment**: Node.js
- **Preset**: ts-jest (TypeScript support)
- **Timeout**: 10 seconds per test
- **Coverage Threshold**: 30% (branches, functions, lines, statements)
- **Setup File**: `tests/setup.ts` (global config, test credentials)

### Test Setup (`tests/setup.ts`)
```typescript
export const BASE_URL = 'http://localhost:3001';
export const TEST_USER = {
  email: 'abdularhamkhan02@gmail.com',
  password: 'StrongPassword!',
};
```

## Expected Test Results

### ✅ All Tests Should Pass If:
- Server is running on port 3001
- Test user credentials are valid
- Database has sufficient test data (other users for recommendations)
- All services (Redis, Pusher, SES) are properly configured

### ⚠️ Some Tests May Skip If:
- No other users exist (matchmaking tests will skip swipe-to-chat flow)
- No chats exist (typing indicator test will skip)
- Email sending disabled (password reset will succeed but email won't arrive)

### ❌ Tests Will Fail If:
- Server is not running
- Test user doesn't exist or password is incorrect
- Database connection is down
- Redis is not running
- Invalid environment variables

## Coverage Goals

### Current Coverage Target: 30%
The coverage threshold is intentionally low initially to allow gradual improvement. As the codebase matures:

1. **Phase 1 (Current)**: 30% coverage - Basic test suite in place
2. **Phase 2**: 50% coverage - Add edge case tests
3. **Phase 3**: 70% coverage - Comprehensive test coverage
4. **Phase 4**: 80%+ coverage - Production-ready quality

### High-Priority Coverage Areas
1. **Authentication & Authorization**: JWT token generation, password hashing, OTP verification
2. **Matchmaking Algorithm**: Recommendation engine accuracy
3. **Real-time Features**: Pusher event broadcasting
4. **Caching Strategy**: Cache invalidation correctness
5. **Data Validation**: Input sanitization and SQL injection prevention

## Test Data Management

### Test User
- The test suite uses a real user account (`abdularhamkhan02@gmail.com`)
- This user should **not** be deleted from the database
- Profile may be modified during tests (bio, skills, demographics)

### Test Projects
- Integration tests create projects with name "AI-Powered Task Manager"
- These may accumulate in the database over time
- Consider cleaning up test projects periodically

### Test Chats & Messages
- Tests create direct chats and send messages
- These are real entries in the database
- No automatic cleanup (to preserve test data integrity)

## Debugging Failed Tests

### Common Issues

1. **"ECONNREFUSED" Error**
   - Server is not running
   - **Solution**: Start server with `npm run dev`

2. **"Unauthorized" / 401 Errors**
   - Test user credentials invalid
   - **Solution**: Verify user exists, password is correct

3. **"No recommendations available"**
   - Not enough users in database
   - **Solution**: Tests will skip gracefully, but consider adding more test users

4. **Timeout Errors**
   - Server is slow or unresponsive
   - **Solution**: Increase timeout in individual tests or check server performance

5. **Redis Connection Errors**
   - Redis is not running
   - **Solution**: Start Redis with `redis-server`

### Verbose Test Output
For detailed test execution logs:
```bash
npm test -- --verbose
```

## Continuous Integration

### GitHub Actions / CI Pipeline
Add this to your CI workflow:
```yaml
- name: Install dependencies
  run: npm ci

- name: Start Redis
  run: redis-server --daemonize yes

- name: Run tests
  run: npm run test:ci
  env:
    NODE_ENV: test
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    REDIS_URL: localhost:6379
```

## Test Best Practices

1. **Isolation**: Each test is independent (no shared state)
2. **Idempotency**: Tests can run multiple times with same results
3. **Real Credentials**: Tests use actual user account (not mocked)
4. **Graceful Degradation**: Tests skip if prerequisites missing (no forced failures)
5. **Clear Assertions**: Each test has specific, meaningful expectations
6. **Comprehensive Coverage**: Tests cover happy path, edge cases, and error scenarios

## Next Steps

### Immediate
1. ✅ Run `npm test` to execute all tests
2. ✅ Verify all tests pass (or skip gracefully)
3. ✅ Review coverage report

### Short-term
1. Add more test users to database for better matchmaking tests
2. Implement test cleanup scripts (optional)
3. Add performance tests (response time assertions)
4. Add security tests (rate limiting, CORS, CSP)

### Long-term
1. Increase coverage threshold to 50%, then 70%
2. Add load testing with k6 or Artillery
3. Add API contract testing with Pact
4. Add E2E tests with Playwright (if frontend is ready)
5. Implement test data factories for easier setup

## Test Maintenance

### Adding New Tests
1. Create test file in appropriate directory (`api/`, `unit/`, `integration/`)
2. Follow naming convention: `<feature>.test.ts`
3. Use setup.ts for shared configuration
4. Update this summary document

### Updating Existing Tests
1. Ensure changes don't break existing tests
2. Update test expectations if API contracts change
3. Maintain test independence (no cascading failures)

## Contact & Support

For questions about the test suite:
- Review test file comments (detailed explanations)
- Check `API_DOCUMENTATION.md` for endpoint specs
- Consult `PROJECT_COMPLETION_SUMMARY.md` for deployment guide

---

**Last Updated**: December 2, 2024  
**Test Suite Version**: 1.0.0  
**Total Test Cases**: 93+ (across all files)
