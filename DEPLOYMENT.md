# 🚀 WAT Backend - Production Deployment Guide

This guide covers the complete setup for deploying the WAT Backend using Docker containers with automated CI/CD via GitHub Actions.

## 📋 Table of Contents

- [🏗️ Infrastructure Setup](#️-infrastructure-setup)
- [🔐 Repository Secrets Configuration](#-repository-secrets-configuration)
- [🐳 Docker Configuration](#-docker-configuration)
- [⚙️ Server Setup](#️-server-setup)
- [🚀 CI/CD Pipeline](#-cicd-pipeline)
- [📊 Monitoring & Maintenance](#-monitoring--maintenance)
- [🔧 Troubleshooting](#-troubleshooting)

## 🏗️ Infrastructure Setup

### Server Requirements

**Staging Server:**
- 2GB RAM minimum, 4GB recommended
- 20GB disk space minimum
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Nginx installed (for reverse proxy)

**Production Server:**
- 4GB RAM minimum, 8GB recommended
- 40GB disk space minimum
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- Nginx installed (for reverse proxy)
- SSL certificate configured

### Domain Setup

Configure your domains to point to your servers:
- **Staging**: `staging-api.wat.vcern.com`
- **Production**: `api.wat.vcern.com`

## 🔐 Repository Secrets Configuration

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

### Staging Environment
```
STAGING_HOST=your-staging-server-ip-or-domain
STAGING_USER=deploy
STAGING_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...your SSH private key...
-----END OPENSSH PRIVATE KEY-----
STAGING_PORT=22
```

### Production Environment
```
PRODUCTION_HOST=your-production-server-ip-or-domain
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...your SSH private key...
-----END OPENSSH PRIVATE KEY-----
PRODUCTION_PORT=22
```

### Notifications (Optional)
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## 🐳 Docker Configuration

The project includes a multi-stage Dockerfile optimized for production:

- **Development stage**: Hot reload, debugging tools
- **Production stage**: Minimized image, optimized for performance

### Local Testing

```bash
# Build and test locally
docker build -t wat-backend:local .

# Run with docker-compose (production mode)
docker-compose up -d

# Run with development profile
docker-compose --profile development up -d

# Include Prisma Studio for database management
docker-compose --profile development --profile tools up -d
```

## ⚙️ Server Setup

### 1. Create Deploy User

On both staging and production servers:

```bash
# Create deploy user
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy

# Switch to deploy user
sudo su - deploy

# Create SSH key directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key to authorized_keys
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Install other utilities
sudo apt install curl jq git -y
```

### 3. Create Docker Network

```bash
# Create network for containers
docker network create wat-network
```

### 4. Environment Files

Create environment files for each environment:

**Staging**: `/home/deploy/.env.staging`
```bash
NODE_ENV=staging
PORT=3000
DATABASE_URL=your_staging_database_url
DIRECT_URL=your_staging_direct_url
REDIS_URL=redis://redis:6379
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
OPTIMIZE_API_KEY=your_optimize_api_key
FRONTEND_URL=https://staging.wat.vcern.com
```

**Production**: `/home/deploy/.env.production`
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=your_production_database_url
DIRECT_URL=your_production_direct_url
REDIS_URL=redis://redis:6379
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
OPTIMIZE_API_KEY=your_optimize_api_key
FRONTEND_URL=https://wat.vcern.com
```

### 5. Nginx Configuration

Create Nginx configuration for your API:

**Staging**: `/etc/nginx/sites-available/wat-api-staging`
```nginx
server {
    listen 80;
    server_name staging-api.wat.vcern.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Production**: `/etc/nginx/sites-available/wat-api`
```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name api.wat.vcern.com;

    # SSL Configuration (replace with your certificates)
    ssl_certificate /etc/letsencrypt/live/api.wat.vcern.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.wat.vcern.com/privkey.pem;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_Set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers for API
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
    }
}
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/wat-api-staging /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/wat-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🚀 CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **Quality Checks**: Runs linting, tests, type checking, and security audits
2. **Docker Build**: Creates optimized multi-platform images
3. **Security Scanning**: Scans images for vulnerabilities with Trivy
4. **Deployment**: 
   - **Staging**: Simple container replacement on `main` branch
   - **Production**: Blue-green deployment on `production` branch
5. **Notifications**: Sends Slack notifications on completion

### Deployment Triggers

- **Automatic**: Push to `main` (staging) or `production` branch
- **Manual**: Use GitHub Actions UI with environment selection
- **Emergency**: Manual deployment with option to skip tests

### Branch Strategy

```bash
main branch → staging environment
production branch → production environment
```

### Manual Deployment

1. Go to GitHub Actions tab
2. Select "🚀 Deploy to Production" workflow
3. Click "Run workflow"
4. Select environment and options
5. Click "Run workflow"

## 📊 Monitoring & Maintenance

### Health Checks

The application includes built-in health endpoints:
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

### Container Management

```bash
# View running containers
docker ps --filter "name=wat-backend"

# View logs
docker logs -f wat-backend-production
docker logs -f wat-backend-staging

# Container stats
docker stats $(docker ps -q --filter "name=wat-backend")

# Execute commands in container
docker exec -it wat-backend-production npm run prisma:status
```

### Database Maintenance

```bash
# Run migrations
docker exec wat-backend-production npx prisma migrate deploy

# View database status
docker exec wat-backend-production npx prisma migrate status

# Reset database (DANGEROUS - staging only)
docker exec wat-backend-staging npx prisma migrate reset --force
```

### Backup Strategy

The deployment script automatically creates backups before deployment:
- Location: `/var/backups/wat-backend/`
- Retention: Keep last 7 backups
- Format: Docker container export

```bash
# Manual backup
./scripts/deploy.sh production --backup-only

# Restore from backup
docker load < /var/backups/wat-backend/backup_20231201_120000.tar
```

## 🔧 Troubleshooting

### Common Issues

#### Deployment Fails with Permission Denied
```bash
# Check SSH key permissions
chmod 600 ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa

# Test SSH connection
ssh deploy@your-server-ip
```

#### Container Won't Start
```bash
# Check container logs
docker logs wat-backend-production

# Check environment variables
docker exec wat-backend-production env

# Verify network connectivity
docker network ls
docker network inspect wat-network
```

#### Database Connection Issues
```bash
# Test database connectivity
docker exec wat-backend-production npx prisma db push --accept-data-loss

# Check Prisma client
docker exec wat-backend-production npx prisma generate
```

#### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### Emergency Procedures

#### Quick Rollback
```bash
# Stop current container
docker stop wat-backend-production

# Start previous backup
docker start wat-backend-production-backup

# Update Nginx if needed
sudo systemctl reload nginx
```

#### Manual Deployment
```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production (with confirmation)
./scripts/deploy.sh production

# Force deploy (skip confirmation)
./scripts/deploy.sh production --force

# Deploy without backup
./scripts/deploy.sh production --skip-backup

# Dry run (see what would happen)
./scripts/deploy.sh production --dry-run
```

### Logs and Debugging

```bash
# Application logs
docker logs -f --tail 100 wat-backend-production

# System logs
journalctl -u docker.service -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check server logs and container status
4. Verify environment variables and secrets

## 🔄 Updates and Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review deployment logs and container health
2. **Monthly**: Update base Docker images and dependencies
3. **Quarterly**: Review and update SSL certificates
4. **As needed**: Scale resources based on usage patterns

### Scaling Considerations

- **Horizontal**: Add more server instances behind a load balancer
- **Vertical**: Increase server resources (CPU/RAM)
- **Database**: Consider read replicas for high traffic
- **Caching**: Implement Redis clustering for high availability

---

**🎉 Your WAT Backend is now ready for production deployment!**

The CI/CD pipeline will automatically handle deployments when you push to the appropriate branches. Monitor the GitHub Actions tab for deployment status and logs.
