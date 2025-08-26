# 🚀 **DEPLOYMENT COMMANDS - A to Z**

**WAT Game Backend - Digital Ocean Droplet Deployment**

**Target Environment:** Digital Ocean Droplet with Docker Containers  
**Deployment Method:** Manual tar file deployment  
**Containers:** Redis Server + WAT Backend Server (Port 3000)

---

## 📦 **1. LOCAL PREPARATION**

### **Create Production Build**
```bash
# Navigate to project directory
cd /home/abdul/Desktop/with-a-twist

# Clean and build
npm run build

# Create deployment package (exclude dev files)
tar -czf wat-backend-v1.2.0.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=*.log \
  --exclude=.env \
  --exclude=prisma/migrations \
  --exclude=src \
  dist/ \
  package.json \
  package-lock.json \
  prisma/ \
  docker-compose.yml \
  Dockerfile \
  .env.example \
  README.md \
  COMPLETE_API_REFERENCE.md

# Verify package contents
tar -tzf wat-backend-v1.2.0.tar.gz | head -20
```

---

## 🌊 **2. DIGITAL OCEAN DROPLET SETUP**

### **Upload to Droplet**
```bash
# Upload tar file to droplet
scp wat-backend-v1.2.0.tar.gz root@YOUR_DROPLET_IP:/opt/

# SSH into droplet
ssh root@YOUR_DROPLET_IP
```

### **Extract and Setup**
```bash
# Navigate to deployment directory
cd /opt

# Extract deployment package
tar -xzf wat-backend-v1.2.0.tar.gz

# Rename to consistent directory
mv with-a-twist wat-backend || mv . wat-backend
cd wat-backend

# Set proper permissions
chmod +x dist/server.js
```

---

## 🐳 **3. DOCKER CONTAINERS MANAGEMENT**

### **Stop Existing Containers**
```bash
# Stop all running containers
docker stop $(docker ps -q) 2>/dev/null || true

# Remove existing containers
docker rm redis-server wat-backend-server 2>/dev/null || true

# Clean up unused images (optional)
docker image prune -f
```

### **Start Redis Container**
```bash
# Pull latest Redis image
docker pull redis:7-alpine

# Start Redis server container
docker run -d \
  --name redis-server \
  --restart unless-stopped \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine redis-server --appendonly yes
```

### **Verify Redis is Running**
```bash
# Check Redis container status
docker ps | grep redis-server

# Test Redis connection
docker exec redis-server redis-cli ping
```

---

## ⚙️ **4. ENVIRONMENT CONFIGURATION**

### **Create Production Environment File**
```bash
# Create production .env file
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name"
DIRECT_URL="postgresql://username:password@host:5432/database_name"

# Redis Configuration  
REDIS_URL="redis://localhost:6379"

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# JWT Configuration
JWT_SECRET="your-secure-jwt-secret-min-32-chars"

# Application Configuration
NODE_ENV="production"
PORT=3000
FRONTEND_URL="https://your-frontend-domain.com"

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET="your-session-secret"
EOF

# Secure the environment file
chmod 600 .env
```

---

## 🗄️ **5. DATABASE SETUP**

### **Install Dependencies and Run Migrations**
```bash
# Install production dependencies only
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Verify database connection
npx prisma db pull --force 2>/dev/null && echo "Database connected successfully"
```

---

## 🐳 **6. BUILD AND START BACKEND CONTAINER**

### **Create Dockerfile (if not exists)**
```bash
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY dist ./dist/
COPY .env ./

# Generate Prisma client
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
EOF
```

### **Build and Run Backend Container**
```bash
# Build Docker image
docker build -t wat-backend:v1.2.0 .

# Start WAT backend container
docker run -d \
  --name wat-backend-server \
  --restart unless-stopped \
  -p 3000:3000 \
  --link redis-server:redis \
  --env-file .env \
  wat-backend:v1.2.0

# Alternative: Using docker-compose (if exists)
# docker-compose up -d
```

---

## ✅ **7. VERIFICATION & HEALTH CHECKS**

### **Check Container Status**
```bash
# Check all containers are running
docker ps

# Check container logs
docker logs redis-server --tail 50
docker logs wat-backend-server --tail 50

# Check container resource usage
docker stats --no-stream
```

### **Test API Endpoints**
```bash
# Test health check (replace with actual health endpoint)
curl -s http://localhost:3000/ | head -10

# Test authentication endpoint
curl -s -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"test@example.com","username":"testuser","password":"TestPass123!","firstName":"Test","lastName":"User"}' \
  | head -10

# Test online count endpoint (requires auth)
# curl -s http://localhost:3000/api/users/online/count \
#   -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check Redis connectivity
docker exec redis-server redis-cli info replication
```

### **Network Connectivity**
```bash
# Check if containers can communicate
docker exec wat-backend-server ping -c 2 redis-server

# Check port accessibility
netstat -tlnp | grep :3000
netstat -tlnp | grep :6379
```

---

## 🔄 **8. UPDATE DEPLOYMENT (Future Updates)**

### **Quick Update Process**
```bash
# Stop existing backend container
docker stop wat-backend-server
docker rm wat-backend-server

# Upload new tar file and extract
cd /opt
rm -rf wat-backend-old
mv wat-backend wat-backend-old 2>/dev/null || true
tar -xzf wat-backend-v1.2.1.tar.gz
cd wat-backend

# Copy production environment
cp ../wat-backend-old/.env . 2>/dev/null || echo "Create new .env file"

# Install dependencies and migrate
npm ci --only=production
npx prisma generate
npx prisma migrate deploy

# Rebuild and restart
docker build -t wat-backend:v1.2.1 .
docker run -d \
  --name wat-backend-server \
  --restart unless-stopped \
  -p 3000:3000 \
  --link redis-server:redis \
  --env-file .env \
  wat-backend:v1.2.1

# Verify deployment
docker logs wat-backend-server --tail 30
```

---

## 🛠️ **9. MAINTENANCE COMMANDS**

### **Container Management**
```bash
# Restart containers
docker restart redis-server wat-backend-server

# View detailed container info
docker inspect wat-backend-server | grep -A 10 "NetworkSettings"

# Access container shell (debugging)
docker exec -it wat-backend-server sh
docker exec -it redis-server redis-cli

# Monitor container logs in real-time
docker logs -f wat-backend-server
```

### **Database Maintenance**
```bash
# Run migrations
docker exec wat-backend-server npx prisma migrate deploy

# Reset database (CAUTION: Destroys data)
# docker exec wat-backend-server npx prisma migrate reset --force

# Check database status
docker exec wat-backend-server npx prisma db pull --force
```

### **Redis Maintenance**
```bash
# Redis memory usage
docker exec redis-server redis-cli info memory

# Clear Redis cache (if needed)
# docker exec redis-server redis-cli FLUSHALL

# Redis key count
docker exec redis-server redis-cli dbsize

# Check presence data
docker exec redis-server redis-cli zcard presence:online
```

---

## 🔥 **10. TROUBLESHOOTING**

### **Common Issues**

**Container Won't Start:**
```bash
# Check Docker logs
docker logs wat-backend-server
docker logs redis-server

# Check port conflicts
netstat -tlnp | grep :3000
netstat -tlnp | grep :6379

# Check disk space
df -h
```

**Database Connection Issues:**
```bash
# Test database connectivity
docker exec wat-backend-server node -e "
const { PrismaClient } = require('./prisma/generated/prisma');
const prisma = new PrismaClient();
prisma.\$connect().then(() => console.log('DB Connected')).catch(console.error);
"
```

**Redis Connection Issues:**
```bash
# Check Redis logs
docker logs redis-server

# Test Redis from backend container
docker exec wat-backend-server node -e "
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
redis.ping().then(console.log).catch(console.error);
"
```

**Performance Issues:**
```bash
# Monitor resource usage
docker stats

# Check container resource limits
docker inspect wat-backend-server | grep -A 5 "Memory"

# Top processes
top -p $(docker inspect -f '{{.State.Pid}}' wat-backend-server)
```

### **Emergency Commands**
```bash
# Emergency restart all services
docker restart redis-server wat-backend-server

# Stop all services
docker stop redis-server wat-backend-server

# Complete reset (CAUTION)
# docker stop $(docker ps -q)
# docker rm $(docker ps -aq)
# docker volume rm redis-data

# Check system resources
free -h
df -h
```

---

## 📝 **11. DEPLOYMENT CHECKLIST**

### **Pre-Deployment**
- [ ] Build completed successfully (`npm run build`)
- [ ] Environment variables configured
- [ ] Database credentials updated
- [ ] Supabase keys configured
- [ ] JWT secret set (min 32 characters)

### **During Deployment**
- [ ] Containers stopped gracefully
- [ ] New containers started successfully
- [ ] Database migrations applied
- [ ] Redis server accessible
- [ ] API endpoints responding

### **Post-Deployment**
- [ ] Health checks passing
- [ ] Authentication working
- [ ] Presence system operational
- [ ] Database queries working
- [ ] Redis cache functioning
- [ ] Rate limiting active
- [ ] Error handling working

---

## 🎯 **QUICK DEPLOYMENT SUMMARY**

```bash
# Complete deployment in 8 commands:

# 1. Upload and extract
scp wat-backend-v1.2.0.tar.gz root@YOUR_DROPLET_IP:/opt/
ssh root@YOUR_DROPLET_IP
cd /opt && tar -xzf wat-backend-v1.2.0.tar.gz && cd wat-backend

# 2. Stop old containers
docker stop $(docker ps -q) && docker rm redis-server wat-backend-server

# 3. Start Redis
docker run -d --name redis-server --restart unless-stopped -p 6379:6379 redis:7-alpine

# 4. Setup environment
cp .env.example .env && nano .env  # Edit with production values

# 5. Install and migrate
npm ci --only=production && npx prisma generate && npx prisma migrate deploy

# 6. Build and run backend
docker build -t wat-backend:v1.2.0 .
docker run -d --name wat-backend-server --restart unless-stopped -p 3000:3000 --link redis-server:redis --env-file .env wat-backend:v1.2.0

# 7. Verify deployment
docker ps && curl -s http://localhost:3000/
```

**🚀 DEPLOYMENT COMPLETE!**
