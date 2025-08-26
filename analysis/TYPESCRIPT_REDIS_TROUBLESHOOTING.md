# 🔧 TypeScript + Redis Common Issues & Solutions

## 🎯 The Issues We Just Fixed (Learning from Real Problems)

---

## 1. ❌ Import Path Mismatches

### The Problem
```typescript
// ❌ Wrong - file doesn't exist or isn't exporting
import { sessionRedis } from '../config/redis.config';
```

### The Solution
```typescript
// ✅ Correct - use the actual file path
import { sessionRedis } from '../config/redis.production.config';
```

### 🧠 Prevention Strategy
- Always check if the file exists: `ls src/redis/config/`
- Verify exports: `grep "export" src/redis/config/redis.production.config.ts`
- Use relative paths consistently

---

## 2. ❌ Type Mismatches with ioredis

### The Problem
```typescript
// ❌ TypeScript doesn't know about custom Redis methods
client.del = async (...keys: string[]) => { /* ... */ };
```

### The Solution
```typescript
// ✅ Use proper type casting
const enhancedClient = client as EnhancedRedisClient;
enhancedClient.del = async (...keys: RedisKey[]) => { /* ... */ };
```

### 🧠 Prevention Strategy
- Create custom interfaces in `types/redis.types.ts`
- Use type assertions when extending Redis clients
- Prefer composition over modification

---

## 3. ❌ Error Type Issues

### The Problem
```typescript
// ❌ TypeScript doesn't know error type
} catch (error) {
  console.warn('Error:', error.message); // TS Error!
}
```

### The Solution
```typescript
// ✅ Proper error handling
} catch (error) {
  console.warn('Error:', error instanceof Error ? error.message : String(error));
}
```

### 🧠 Prevention Strategy
- Always check `error instanceof Error`
- Use type guards for error handling
- Consider using a utility function for error formatting

---

## 4. ❌ Interface Compatibility Issues

### The Problem
```typescript
// ❌ Interface mismatch
interface ProductionRedisClients {
  session: RedisStandalone | RedisCluster;
}

private clients: { [key: string]: Redis | Cluster }; // Doesn't match!
```

### The Solution
```typescript
// ✅ Use compatible types
private clients: { [key: string]: Redis | Cluster };

public getClients(): { [key: string]: Redis | Cluster } {
  return this.clients;
}
```

### 🧠 Prevention Strategy
- Keep interfaces simple and flexible
- Use union types for compatibility
- Test interface compatibility early

---

## 5. ❌ Missing or Invalid Redis Options

### The Problem
```typescript
// ❌ Using non-existent Redis options
const config: RedisOptions = {
  maxLoadingTimeout: 5000, // Doesn't exist!
  retryDelayOnFailover: 200, // Only for clusters!
};
```

### The Solution
```typescript
// ✅ Use valid options for each context
const standaloneConfig: RedisOptions = {
  connectTimeout: 10000,
  commandTimeout: 5000,
  // Remove cluster-specific options
};

const clusterConfig = {
  retryDelayOnFailover: 100, // Only in cluster config
  redisOptions: standaloneConfig
};
```

### 🧠 Prevention Strategy
- Check ioredis documentation for valid options
- Separate standalone and cluster configurations
- Use TypeScript intellisense to verify options

---

## 🔧 Quick Fix Patterns

### Pattern 1: Safe Module Imports
```typescript
// Instead of direct imports that might fail
let module: any;
try {
  module = require('./some-module');
} catch (error) {
  console.warn('Module not available:', error instanceof Error ? error.message : String(error));
  module = null;
}
```

### Pattern 2: Type-Safe Redis Operations
```typescript
// Create a type-safe wrapper
export interface SafeRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<'OK'>;
  del(...keys: string[]): Promise<number>;
}

const createSafeClient = (redis: Redis): SafeRedisClient => ({
  async get(key: string) {
    return await redis.get(key);
  },
  
  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return await redis.setex(key, ttl, value);
    }
    return await redis.set(key, value);
  },
  
  async del(...keys: string[]) {
    return await redis.del(...keys);
  }
});
```

### Pattern 3: Error-Safe Configuration
```typescript
const getRedisConfig = (): RedisOptions => {
  const baseConfig: RedisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    connectTimeout: 10000,
    commandTimeout: 5000,
    maxRetriesPerRequest: 3,
  };

  // Only add auth if provided
  if (process.env.REDIS_PASSWORD) {
    baseConfig.password = process.env.REDIS_PASSWORD;
  }

  return baseConfig;
};
```

---

## 🧰 Debugging Tools & Commands

### 1. Check File Existence
```bash
# Verify files exist
ls -la src/redis/config/
ls -la src/types/

# Check for TypeScript files
find src -name "*.ts" | grep redis
```

### 2. Verify Exports
```bash
# Check what's exported from a file
grep -n "export" src/redis/config/redis.production.config.ts

# Check imports in a file
grep -n "import" src/redis/session/sessionManager.ts
```

### 3. TypeScript Compilation Check
```bash
# Check specific file compilation
npx tsc --noEmit src/redis/index.ts

# Check all files
npx tsc --noEmit
```

### 4. Redis Connection Test
```typescript
// Quick connection test
const testRedis = async () => {
  try {
    const result = await redis.ping();
    console.log('Redis connected:', result === 'PONG');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
};
```

---

## 📋 Pre-Implementation Checklist

### Before Writing Redis Code:
- [ ] ✅ Redis server is running (`redis-cli ping`)
- [ ] ✅ Dependencies installed (`npm list ioredis`)
- [ ] ✅ Environment variables set (`echo $REDIS_HOST`)
- [ ] ✅ Types defined (`ls src/types/redis.types.ts`)

### Before Committing Changes:
- [ ] ✅ TypeScript compiles (`npx tsc --noEmit`)
- [ ] ✅ All imports resolve correctly
- [ ] ✅ Redis connections work in development
- [ ] ✅ Error handling is implemented

### Before Production Deployment:
- [ ] ✅ Circuit breakers configured
- [ ] ✅ Connection pooling enabled
- [ ] ✅ Monitoring/logging implemented
- [ ] ✅ Graceful shutdown handled

---

## 🚨 Common Anti-Patterns to Avoid

### ❌ Don't: Hardcode Redis operations everywhere
```typescript
// ❌ Bad - scattered Redis calls
app.get('/users/:id', async (req, res) => {
  const user = await redis.get(`user:${req.params.id}`);
  // ...
});
```

### ✅ Do: Use abstraction layers
```typescript
// ✅ Good - centralized cache logic
app.get('/users/:id', async (req, res) => {
  const user = await UserCache.get(req.params.id);
  // ...
});
```

### ❌ Don't: Ignore connection errors
```typescript
// ❌ Bad - no error handling
const redis = new Redis();
```

### ✅ Do: Handle connection lifecycle
```typescript
// ✅ Good - comprehensive error handling
const redis = new Redis({
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3
});

redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('Redis connected'));
```

---

## 🎯 Remember: The Goal is Simplicity

**Complex implementations = More bugs**
**Simple patterns = Reliable systems**

Focus on these 3 rules:
1. **Keep types simple** - Use basic interfaces, avoid complex generics
2. **Handle errors gracefully** - Always expect Redis to fail
3. **Use proven patterns** - Stick to the 8 boilerplate templates

The complex Redis implementation we built is powerful, but for day-to-day work, the simple boilerplate templates are what you'll actually use and remember!
