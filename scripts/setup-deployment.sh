#!/bin/bash

# =============================================================================
# 🛠️ WAT BACKEND DEPLOYMENT SETUP SCRIPT
# =============================================================================
# 
# This script helps set up the deployment environment on your servers
# 
# Usage: ./scripts/setup-deployment.sh [staging|production]
#
# =============================================================================

set -euo pipefail

# =============================================================================
# 🌍 CONFIGURATION
# =============================================================================
ENVIRONMENT="${1:-production}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# =============================================================================
# 🛠️ UTILITY FUNCTIONS
# =============================================================================

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

print_banner() {
    echo -e "${CYAN}"
    echo "============================================================================="
    echo "🛠️  WAT BACKEND DEPLOYMENT SETUP"
    echo "Environment: $ENVIRONMENT"
    echo "============================================================================="
    echo -e "${NC}"
}

# =============================================================================
# 🔧 SETUP FUNCTIONS
# =============================================================================

check_requirements() {
    log "Checking system requirements..."
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Please run as the deploy user."
        exit 1
    fi
    
    # Check for required commands
    local required_commands=("docker" "docker-compose" "nginx" "curl" "git")
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error "Required command '$cmd' is not installed"
            echo "Please install $cmd and run this script again"
            exit 1
        fi
    done
    
    log "All requirements satisfied ✓"
}

setup_docker() {
    log "Setting up Docker environment..."
    
    # Create Docker network if it doesn't exist
    if ! docker network inspect wat-network &> /dev/null; then
        docker network create wat-network
        log "Created Docker network 'wat-network' ✓"
    else
        log "Docker network 'wat-network' already exists ✓"
    fi
    
    # Create necessary directories
    mkdir -p ~/uploads ~/logs ~/.wat-backend
    
    log "Docker setup completed ✓"
}

create_env_template() {
    local env_file="$HOME/.env.$ENVIRONMENT"
    
    log "Creating environment template: $env_file"
    
    if [[ -f "$env_file" ]]; then
        warn "Environment file already exists. Creating backup..."
        cp "$env_file" "$env_file.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    cat > "$env_file" << EOF
# =============================================================================
# WAT BACKEND ENVIRONMENT CONFIGURATION - $(echo "$ENVIRONMENT" | tr '[:lower:]' '[:upper:]')
# =============================================================================

NODE_ENV=$ENVIRONMENT
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name
DIRECT_URL=postgresql://username:password@host:port/database_name

# Redis Configuration
REDIS_URL=redis://redis:6379

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# External APIs
OPTIMIZE_API_KEY=your_optimize_api_key_here

# Frontend Configuration
FRONTEND_URL=https://$([ "$ENVIRONMENT" = "staging" ] && echo "staging." || echo "")wat.vcern.com

# Logging and Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
EOF

    echo -e "${YELLOW}"
    echo "============================================================================="
    echo "📝 ENVIRONMENT CONFIGURATION"
    echo "============================================================================="
    echo -e "${NC}"
    echo "Environment file created: $env_file"
    echo ""
    echo "⚠️  IMPORTANT: Please update the following values in $env_file:"
    echo ""
    echo "  - DATABASE_URL: Your PostgreSQL connection string"
    echo "  - DIRECT_URL: Your direct PostgreSQL connection string"
    echo "  - SUPABASE_URL: Your Supabase project URL"
    echo "  - SUPABASE_ANON_KEY: Your Supabase anonymous key"
    echo "  - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key"
    echo "  - JWT_SECRET: A secure random string for JWT signing"
    echo "  - OPTIMIZE_API_KEY: Your Optimize API key"
    echo ""
    echo "💡 You can edit the file with: nano $env_file"
    echo ""
}

setup_nginx() {
    local site_name="wat-api"
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        site_name="wat-api-staging"
    fi
    
    local nginx_config="/etc/nginx/sites-available/$site_name"
    
    log "Setting up Nginx configuration..."
    
    if [[ -f "$nginx_config" ]]; then
        warn "Nginx configuration already exists: $nginx_config"
        return 0
    fi
    
    # Check if user can write to nginx directory
    if [[ ! -w "/etc/nginx/sites-available" ]]; then
        warn "Cannot write to /etc/nginx/sites-available. You'll need to create the Nginx config manually."
        echo ""
        echo "Create the following file as root: $nginx_config"
        echo ""
        
        if [[ "$ENVIRONMENT" == "staging" ]]; then
            cat << 'EOF'
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
EOF
        else
            cat << 'EOF'
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
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
        fi
        
        echo ""
        echo "Then enable the site with:"
        echo "  sudo ln -s /etc/nginx/sites-available/$site_name /etc/nginx/sites-enabled/"
        echo "  sudo nginx -t"
        echo "  sudo systemctl reload nginx"
        
        return 0
    fi
    
    log "Nginx configuration setup guidance provided ✓"
}

setup_ssl() {
    if [[ "$ENVIRONMENT" != "production" ]]; then
        log "SSL setup skipped (not production environment)"
        return 0
    fi
    
    log "SSL Certificate Setup Instructions:"
    echo ""
    echo "For production, you'll need SSL certificates. Here are your options:"
    echo ""
    echo "1. Let's Encrypt (Recommended - Free):"
    echo "   sudo apt install certbot python3-certbot-nginx"
    echo "   sudo certbot --nginx -d api.wat.vcern.com"
    echo ""
    echo "2. Custom SSL Certificate:"
    echo "   - Upload your certificate files to the server"
    echo "   - Update the nginx configuration with the correct paths"
    echo ""
    echo "3. Cloudflare SSL (if using Cloudflare):"
    echo "   - Configure SSL in Cloudflare dashboard"
    echo "   - Use Full (strict) SSL mode"
    echo ""
}

create_systemd_service() {
    log "Creating systemd service for automatic startup..."
    
    local service_name="wat-backend-$ENVIRONMENT"
    local service_file="/etc/systemd/system/$service_name.service"
    
    if [[ ! -w "/etc/systemd/system" ]]; then
        warn "Cannot write to /etc/systemd/system. You'll need to create the service file manually."
        echo ""
        echo "Create the following file as root: $service_file"
        echo ""
        cat << EOF
[Unit]
Description=WAT Backend $ENVIRONMENT
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=true
User=$USER
WorkingDirectory=$HOME
ExecStart=/usr/local/bin/docker-compose -f docker-compose.yml up -d wat-game-backend
ExecStop=/usr/local/bin/docker-compose -f docker-compose.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
        echo ""
        echo "Then enable the service with:"
        echo "  sudo systemctl daemon-reload"
        echo "  sudo systemctl enable $service_name"
        echo ""
        return 0
    fi
    
    log "Systemd service setup guidance provided ✓"
}

setup_monitoring() {
    log "Setting up monitoring and health checks..."
    
    # Create a simple health check script
    cat > ~/.wat-backend/health-check.sh << 'EOF'
#!/bin/bash

# Simple health check script for WAT Backend
CONTAINER_NAME="${1:-wat-game-backend}"
HEALTH_URL="${2:-http://localhost:3000/health}"

if docker ps | grep -q "$CONTAINER_NAME"; then
    if curl -sf "$HEALTH_URL" > /dev/null; then
        echo "✅ $CONTAINER_NAME is healthy"
        exit 0
    else
        echo "❌ $CONTAINER_NAME is not responding"
        exit 1
    fi
else
    echo "❌ $CONTAINER_NAME is not running"
    exit 1
fi
EOF
    
    chmod +x ~/.wat-backend/health-check.sh
    
    log "Health check script created: ~/.wat-backend/health-check.sh ✓"
}

show_next_steps() {
    echo -e "${BLUE}"
    echo "============================================================================="
    echo "🎯 NEXT STEPS"
    echo "============================================================================="
    echo -e "${NC}"
    echo "1. Update environment variables in: $HOME/.env.$ENVIRONMENT"
    echo ""
    echo "2. Set up Nginx configuration (if not done automatically)"
    echo ""
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo "3. Configure SSL certificates for HTTPS"
        echo ""
        echo "4. Test the deployment:"
    else
        echo "3. Test the deployment:"
    fi
    echo "   ./scripts/deploy.sh $ENVIRONMENT --dry-run"
    echo ""
    echo "$(if [[ "$ENVIRONMENT" == "production" ]]; then echo "5"; else echo "4"; fi). Deploy your application:"
    echo "   ./scripts/deploy.sh $ENVIRONMENT"
    echo ""
    echo "$(if [[ "$ENVIRONMENT" == "production" ]]; then echo "6"; else echo "5"; fi). Monitor health:"
    echo "   ~/.wat-backend/health-check.sh"
    echo ""
    echo "============================================================================="
    echo "📚 For detailed instructions, see: DEPLOYMENT.md"
    echo "============================================================================="
}

# =============================================================================
# 📋 MAIN EXECUTION
# =============================================================================

main() {
    print_banner
    
    # Validate environment
    if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
        error "Invalid environment: $ENVIRONMENT (use 'staging' or 'production')"
        exit 1
    fi
    
    check_requirements
    setup_docker
    create_env_template
    setup_nginx
    setup_ssl
    create_systemd_service
    setup_monitoring
    
    log "🎉 Setup completed for $ENVIRONMENT environment!"
    echo ""
    show_next_steps
}

# =============================================================================
# 🎯 HELP FUNCTION
# =============================================================================

show_help() {
    echo -e "${CYAN}WAT Backend Deployment Setup Script${NC}"
    echo ""
    echo "Usage: $0 [staging|production]"
    echo ""
    echo "Environments:"
    echo "  staging     Set up staging environment"
    echo "  production  Set up production environment (default)"
    echo ""
    echo "This script will:"
    echo "  - Check system requirements"
    echo "  - Set up Docker network and directories"
    echo "  - Create environment configuration template"
    echo "  - Provide Nginx configuration guidance"
    echo "  - Set up SSL certificate instructions (production)"
    echo "  - Create monitoring and health check scripts"
    echo ""
    echo "Examples:"
    echo "  $0 staging"
    echo "  $0 production"
}

# Check for help flag
if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    show_help
    exit 0
fi

# Run main function
main
