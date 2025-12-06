# Test Suite Quick Start Guide

## 🚀 Running Tests in 3 Steps

### Step 1: Start the Server
Open a terminal and run:
```bash
cd /home/arham/Desktop/Uni/FYP/labyrinth_backend_service
npm run dev
```

**Wait for this message:**
```
✓ Server is running on port 3001
✓ Redis connected successfully
✓ Database connected successfully
```

### Step 2: Run Tests
Open a **second terminal** (keep the server running) and run:
```bash
cd /home/arham/Desktop/Uni/FYP/labyrinth_backend_service
npm test
```

### Step 3: View Results
- Green checkmarks ✓ = Tests passed
- Red X = Tests failed (see error details)
- Yellow warnings = Tests skipped (missing prerequisites)

---

## 📊 Test Categories

### Run Only Unit Tests (No Server Required)
These tests run pure logic without HTTP calls:
```bash
npm test tests/unit
```

**Expected Output:**
- ✓ Matchmaking Service - Business Logic (16 tests)
- ✓ Cache Utility - Core Functions (15 tests)  
- ✓ Validation Utilities (26 tests)

### Run Only API Tests (Server Required)
These tests make actual HTTP requests:
```bash
npm test tests/api
```

**Expected Output:**
- ✓ Auth API Tests (8 tests)
- ✓ User API Tests (4 tests)
- ✓ Chat API Tests (5 tests)
- ✓ Matchmaking API Tests (5 tests)
- ✓ Projects API Tests (6 tests)

### Run Only Integration Tests (Server Required)
These tests simulate complete user workflows:
```bash
npm test tests/integration
```

**Expected Output:**
- ✓ Complete User Journey (8 workflow tests)

---

## 🔍 Quick Test (No Server Needed)

To verify your test suite is set up correctly, run unit tests first:
```bash
npm test tests/unit/validation.test.ts
```

**Expected Result:**
```
PASS  tests/unit/validation.test.ts
  Validation Utilities
    Email Validation
      ✓ should validate correct email addresses
      ✓ should reject invalid email addresses
    Password Strength Validation
      ✓ should validate strong passwords
      ✓ should reject weak passwords and provide error messages
    [... 22 more tests ...]

Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
```

---

## 🛠️ Troubleshooting

### Problem: Tests fail with "ECONNREFUSED"
**Cause:** Server is not running  
**Solution:** Start server with `npm run dev` in separate terminal

### Problem: Tests fail with "Unauthorized" (401)
**Cause:** Test user doesn't exist or wrong password  
**Solution:** Verify user `abdularhamkhan02@gmail.com` exists in database

### Problem: "No recommendations available" warning
**Cause:** Not enough users in database for matchmaking  
**Solution:** Tests will skip gracefully (this is normal)

### Problem: Redis connection errors
**Cause:** Redis is not running  
**Solution:** 
```bash
redis-server
```

### Problem: All tests timeout
**Cause:** Server is slow or stuck  
**Solution:** Check server logs, restart server

---

## 📈 Coverage Report

After running tests, generate a coverage report:
```bash
npm run test:coverage
```

View HTML report:
```bash
open coverage/index.html
# or on Linux:
xdg-open coverage/index.html
```

**Current Coverage Target:** 30%

---

## ✅ Success Checklist

Before considering tests complete, verify:

- [ ] Unit tests pass (57+ tests)
- [ ] API tests pass or skip gracefully (28+ tests)
- [ ] Integration tests pass or skip gracefully (8+ tests)
- [ ] Coverage report generated (30%+ coverage)
- [ ] No TypeScript compilation errors
- [ ] Server runs without errors
- [ ] Redis is connected

---

## 📝 Test Results Summary

### Expected Pass/Skip Rates
- **Unit Tests**: 100% pass (no server/data dependencies)
- **API Tests**: 80-100% pass (may skip if data missing)
- **Integration Tests**: 70-90% pass (may skip complex workflows)

### Common Skipped Tests
- Swipe-to-match flow (needs multiple users)
- Chat creation (needs other users)
- Typing indicator (needs existing chat)
- Pusher auth (endpoint might not exist yet)

**These skips are NORMAL and expected!**

---

## 🎯 Next Actions

1. **Run unit tests first** to verify setup
2. **Start server** and run API tests
3. **Review results** and check coverage
4. **Share results** with frontend team
5. **Document any failing tests** for future fixes

---

## 💡 Pro Tips

- Use `npm test -- --verbose` for detailed output
- Use `npm run test:watch` while developing
- Tests create real data in database (not isolated)
- Test user profile may change after tests run
- Keep server running to speed up test iterations

---

**Need Help?**  
See `tests/TEST_SUITE_SUMMARY.md` for full documentation.
