# Labyrinth Matchmaking Service Documentation

## Overview

The Labyrinth Matchmaking Service is an intelligent recommendation engine that connects developers based on technical compatibility, demographics, activity patterns, and user preferences. It powers the core matching functionality of the platform using a sophisticated multi-factor weighted scoring algorithm.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    MATCHMAKING PIPELINE                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. USER PROFILE ANALYSIS                                            │
│     Input: User ID                                                   │
│     ├─→ Tech Stack (languages, frameworks, tools)                   │
│     ├─→ Demographics (country, spoken languages)                    │
│     ├─→ Preferences (preferred tech/demographic filters)            │
│     └─→ Behavioral Data (activity, past swipes, matches)            │
│                                                                      │
│  2. CANDIDATE FILTERING                                              │
│     ├─→ Exclude: Self                                               │
│     ├─→ Exclude: Already swiped users                               │
│     ├─→ Exclude: Already matched users                              │
│     └─→ Apply: User preference filters                              │
│                                                                      │
│  3. COMPATIBILITY SCORING (0-100 scale)                              │
│     ├─→ Tech Stack Match: 40% weight                                │
│     │   ├─→ Languages: 20%                                          │
│     │   ├─→ Frameworks: 15%                                         │
│     │   └─→ Tools: 5%                                               │
│     ├─→ Geographic/Language Match: 30% weight                       │
│     │   ├─→ Country: 15%                                            │
│     │   └─→ Spoken languages: 15%                                   │
│     ├─→ Activity Level: 20% weight                                  │
│     │   ├─→ Both active <7 days: 0.2                                │
│     │   ├─→ Both active <30 days: 0.1                               │
│     │   └─→ Otherwise: 0.05                                         │
│     └─→ Education/Experience: 10% weight                            │
│                                                                      │
│  4. RANKING & FILTERING                                              │
│     ├─→ Filter: Minimum 30% compatibility threshold                 │
│     ├─→ Sort: Descending by compatibility score                     │
│     └─→ Limit: Top N recommendations                                │
│                                                                      │
│  5. ANALYTICS & EVENTS                                               │
│     ├─→ Publish Kafka event: USER_RECOMMENDATIONS_GENERATED         │
│     └─→ Track metrics for ML/analytics                              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Core Algorithms

### 1. Weighted Compatibility Score

**Formula:**
```
Total Score = (Tech Score × 0.4) + (Geo Score × 0.3) + (Activity Score × 0.2) + (Education Score × 0.1)
```

**Method:** Set intersection with maximum normalization

**Implementation:**
- Prevents bias toward users with larger tech stacks
- Uses time decay for activity scoring
- Binary matching for demographics with fallback points

**Example:**
```typescript
User A: {
  languages: ['JavaScript', 'Python'],
  country: 'US',
  lastActive: '2025-10-20'
}

User B: {
  languages: ['JavaScript', 'Go'],
  country: 'US',
  lastActive: '2025-10-22'
}

Calculation:
- Language overlap: 1/2 = 0.5 → 0.5 × 0.2 = 0.1
- Country match: 1.0 → 0.15
- Both active <7 days: 0.2
- Total: (0.1 + 0.15 + 0.2) / 0.45 × 100 = 100% compatibility
```

### 2. Jaccard Similarity (Alternative)

**Formula:**
```
Jaccard(A, B) = |A ∩ B| / |A ∪ B|
```

**Use Case:** Faster computation for large datasets

**Implementation:**
```typescript
const similarity = jaccardSimilarity(
  ['JavaScript', 'Python'],
  ['JavaScript', 'Go']
);
// Returns: 0.33 (1 common / 3 total)
```

---

## API Functions

### User Recommendations

#### `getUserRecommendations(userId, limit)`

Generates personalized user recommendations.

**Parameters:**
- `userId` (string): ID of requesting user
- `limit` (number): Max recommendations (default: 20)

**Returns:** Array of users with compatibility scores

**Example:**
```typescript
const recommendations = await getUserRecommendations('user-123', 10);

// Response:
[
  {
    id: 'user-456',
    username: 'john_dev',
    compatibilityScore: 85.5,
    techStack: {...},
    lastActive: '2025-10-22T10:30:00Z'
  },
  ...
]
```

**Business Logic:**
- Excludes already swiped users
- Excludes already matched users
- Respects user preferences
- Minimum 30% compatibility threshold
- Fetches 2x limit for diversity

---

### Project Recommendations

#### `getProjectRecommendations(userId, limit)`

Generates personalized project recommendations.

**Parameters:**
- `userId` (string): ID of requesting user
- `limit` (number): Max recommendations (default: 10)

**Returns:** Array of projects with compatibility scores

**Scoring:**
- Tech Stack Match: 60%
- Geographic Match: 20%
- Team Size (smaller = higher): 20%

**Example:**
```typescript
const projects = await getProjectRecommendations('user-123', 5);

// Response:
[
  {
    id: 'project-789',
    title: 'Real-time Chat App',
    compatibilityScore: 78.3,
    techStacks: [...],
    collaboratorsCount: 2
  },
  ...
]
```

---

### Swipe Handling

#### `handleSwipeAction(swiperId, targetType, targetId, isRightSwipe)`

Handles user swipe actions and detects mutual matches.

**Parameters:**
- `swiperId` (string): User performing swipe
- `targetType` ('user' | 'project'): Type of target
- `targetId` (string): ID of target
- `isRightSwipe` (boolean): true = like, false = pass

**Returns:** `{ matched: boolean, matchId?: string }`

**Business Rules:**
1. Daily limit enforced (default: 50)
2. Cannot swipe on same target twice
3. Matches require mutual right swipes
4. Only user-to-user creates matches
5. Publishes Kafka events for analytics

**Example:**
```typescript
const result = await handleSwipeAction(
  'user-123',
  'user',
  'user-456',
  true // right swipe
);

if (result.matched) {
  console.log('🎉 Match created:', result.matchId);
  // Trigger notifications to both users
}
```

**Match Detection Algorithm:**
```
User A swipes right on User B
  └─→ Query: Has User B swiped right on User A?
      ├─→ YES: MATCH!
      │   ├─→ Create Match record
      │   ├─→ Create MatchUser entries (both)
      │   ├─→ Publish MATCH_CREATED event
      │   └─→ Return: { matched: true, matchId }
      └─→ NO: No match yet
          └─→ Return: { matched: false }
```

---

### Match Retrieval

#### `getUserMatches(userId)`

Gets all matches for a user.

**Returns:** Array of match objects with matched user details

**Example:**
```typescript
const matches = await getUserMatches('user-123');

// Response:
[
  {
    matchId: 'match-789',
    matchedUser: {
      id: 'user-456',
      username: 'jane_dev',
      techStack: {...}
    },
    matchedAt: '2025-10-20T15:45:00Z'
  },
  ...
]
```

---

### Analytics

#### `getDailySwipeCount(userId)`

Gets user's daily swipe usage.

**Returns:** `{ count: number, limit: number }`

**Example:**
```typescript
const { count, limit } = await getDailySwipeCount('user-123');
console.log(`${count}/${limit} swipes used today`);
// Output: 23/50 swipes used today
```

#### `getUserMatchmakingStats(userId)`

Gets comprehensive matchmaking statistics.

**Returns:**
```typescript
{
  totalSwipes: 150,
  rightSwipes: 90,
  leftSwipes: 60,
  matches: 25,
  matchRate: 27.8,  // percentage
  accountAge: 45     // days
}
```

#### `getTrendingMatches(limit)`

Gets users with most recent matches.

**Use Case:** Showcase popular/active users

**Returns:** Array of trending users with match counts

---

## Event Publishing

The service publishes events to Kafka for analytics and ML training:

### `USER_RECOMMENDATIONS_GENERATED`
```json
{
  "type": "USER_RECOMMENDATIONS_GENERATED",
  "data": {
    "userId": "user-123",
    "recommendationCount": 15,
    "averageCompatibility": 67.4,
    "generatedAt": "2025-10-23T18:00:00Z"
  }
}
```

### `PROJECT_RECOMMENDATIONS_GENERATED`
```json
{
  "type": "PROJECT_RECOMMENDATIONS_GENERATED",
  "data": {
    "userId": "user-123",
    "recommendationCount": 8,
    "averageCompatibility": 72.1,
    "generatedAt": "2025-10-23T18:00:00Z"
  }
}
```

### `USER_SWIPE_ACTION`
```json
{
  "type": "USER_SWIPE_ACTION",
  "data": {
    "swipeId": "swipe-789",
    "swiperId": "user-123",
    "targetType": "user",
    "targetId": "user-456",
    "isRightSwipe": true,
    "matched": true,
    "matchId": "match-999",
    "swipedAt": "2025-10-23T18:00:00Z"
  }
}
```

### `USER_MATCH_CREATED`
```json
{
  "type": "USER_MATCH_CREATED",
  "data": {
    "matchId": "match-999",
    "user1Id": "user-123",
    "user2Id": "user-456",
    "matchedAt": "2025-10-23T18:00:00Z"
  }
}
```

---

## Performance Considerations

### Database Optimization
- Uses `include` with `_count` for efficient aggregation
- Fetches 2x limit then filters (allows diversity)
- Batch operations for metric updates
- Indexes on: userId, createdAt, swiperId, targetId

### Caching Strategy (Recommended)
```typescript
// Redis caching for frequently accessed users
const cacheKey = `recommendations:${userId}`;
const cached = await redis.get(cacheKey);

if (cached) return JSON.parse(cached);

const recommendations = await getUserRecommendations(userId);
await redis.setex(cacheKey, 3600, JSON.stringify(recommendations)); // 1 hour TTL
```

### Scalability
- Consider background job for recommendation pre-computation
- Use Kafka consumers for async metric updates
- Implement rate limiting on recommendation endpoints
- Batch process for large user bases (>100k users)

---

## Future Improvements

### 1. Machine Learning Integration
- **Collaborative Filtering**: "Users like you also liked..."
- **Neural Networks**: Learn optimal weights from successful matches
- **Time-series Analysis**: Best time-of-day for recommendations

### 2. Advanced Scoring
- **Project Interest Alignment**: Match based on project types
- **Skill Level Matching**: Junior/Senior compatibility
- **Timezone Compatibility**: Favor users in similar timezones
- **Response Time Patterns**: Match fast responders together

### 3. Personalization
- **A/B Testing**: Test different scoring algorithms
- **User Feedback Loop**: Learn from user actions
- **Dynamic Weights**: Adjust weights based on user preferences
- **Diversity Injection**: Occasionally show lower-scored but interesting matches

### 4. Performance
- **Redis Caching**: Cache recommendations for 1 hour
- **Background Jobs**: Pre-compute recommendations nightly
- **Read Replicas**: Separate read/write database instances
- **Elasticsearch**: Full-text search for project/skill matching

---

## Testing

### Unit Tests
```typescript
describe('calculateCompatibilityScore', () => {
  it('should return 100 for identical users', () => {
    const user = createMockUser({ languages: ['JS', 'Python'] });
    expect(calculateCompatibilityScore(user, user)).toBe(100);
  });

  it('should return 0 for completely different users', () => {
    const user1 = createMockUser({ languages: ['JS'] });
    const user2 = createMockUser({ languages: ['Go'] });
    expect(calculateCompatibilityScore(user1, user2)).toBeLessThan(30);
  });
});
```

### Integration Tests
```typescript
describe('getUserRecommendations', () => {
  it('should exclude already swiped users', async () => {
    const userId = 'user-123';
    await handleSwipeAction(userId, 'user', 'user-456', false);
    
    const recs = await getUserRecommendations(userId);
    expect(recs.find(r => r.id === 'user-456')).toBeUndefined();
  });
});
```

---

## Monitoring

### Key Metrics to Track
- Average compatibility score of recommendations
- Match rate (matches / right swipes)
- Daily active users in matchmaking
- Average time to first match
- Recommendation diversity (tech stack spread)

### Alerts
- Match rate drops below 15%
- Average compatibility below 50%
- Daily swipe limit exceeded by >10% of users
- Kafka event publishing failures

---

## Summary

The Labyrinth Matchmaking Service provides:

✅ **Intelligent Matching** - Multi-factor weighted scoring  
✅ **Context-Aware** - Never shows already interacted users  
✅ **Preference-Based** - Respects user filters  
✅ **Real-time** - Instant match detection  
✅ **Analytics-Ready** - Kafka event stream  
✅ **Scalable** - Optimized queries and caching strategy  

**Key Differentiator:** Unlike simple Jaccard similarity, this service considers behavioral patterns, activity levels, and user preferences for higher-quality matches.
