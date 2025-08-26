# Leaderboard Ranking and Score System

## Overview
This document outlines the algorithm for building and maintaining the leaderboard ranking and score system for the "With a Twist" game. The system uses Redis for caching and Prisma ORM for database operations.

## Key Components
1. **Global, Weekly, and Daily Leaderboards:**
   - Implemented using Redis sorted sets for rankings.
   - Fallback to database when the cache is unavailable.
   - Automated cache invalidation ensures data consistency.

2. **Scoring System:**
   - Scores are based on game performance, including wins, completed challenges, and other achievements.

## Algorithm
### 1. Cache Key Generator
- Generate cache keys based on the leaderboard type:
  - Global: `leaderboard:global`
  - Weekly: `leaderboard:weekly:<weekStart>`
  - Daily: `leaderboard:daily:<day>`

### 2. Fetching Leaderboard
- Check if the leaderboard is available in the Redis cache.
- If present, return from the cache.
- If absent, retrieve rankings from the database and cache the result.

### 3. Scoring Calculation
- **For each game session:**
  - Calculate the score based on the following:
    - Points for correct guesses.
    - Bonus for fastest completion.
    - Win streaks and achievements.

- **Weekly Scores:** Aggregate scores for the week and update the leaderboard.
- **Daily Scores:** Calculate daily scores for active players and update accordingly.

### 4. Cache Invalidation
- Scheduled invalidation and updates for weekly and daily caches.
- Automatic invalidation when the underlying data changes.

## Implementation
1. **Global Leaderboard:**
   - Fetch players sorted by `totalScore` from the database.
   - Use Redis sorted sets for caching and quick retrieval.

2. **Weekly Leaderboard:**
   - Calculate weekly scores by aggregating completed game sessions.
   - Store in Redis, using the start of the week as part of the cache key.

3. **Daily Leaderboard:**
   - Update daily scores, focusing on active users.
   - Optimize with Redis caching for fast access.

## Future Enhancements
- Real-time updates for ongoing games.
- Enhanced caching strategies to support dynamic data changes.

## Conclusion
The leaderboard and score system provide an engaging way for users to track their performance in "With a Twist". Optimizations using Redis ensure high performance and scalability, supporting seamless user experiences and adaptability.
