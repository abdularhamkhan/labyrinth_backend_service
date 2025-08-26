#!/bin/bash

# =============================================================================
# 🚀 WAT BACKEND DEPLOYMENT SCRIPT
# =============================================================================
# 
# This script automates the deployment process for the WAT backend
# on production and staging servers.
#
# Usage: ./scripts/deploy.sh [staging|production] [options]
#
# =============================================================================

set -euo pipefail

# =============================================================================
# 🌍 CONFIGURATION VARIABLES
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Default values
ENVIRONMENT="${1:-production}"
FORCE_DEPLOY=false
SKIP_BACKUP=false
DRY_RUN=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# =============================================================================
# 🛠️ UTILITY FUNCTIONS
# =============================================================================

print_banner() {
    echo -e "${CYAN}"
    echo "============================================================================="
    echo "🚀 WAT BACKEND DEPLOYMENT SCRIPT"
    echo "Environment: $ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo "============================================================================="
    echo -e "${NC}"
}

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

# =============================================================================
# 🏥 HEALTH CHECK FUNCTIONS
# =============================================================================

check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
        exit 1
    fi
    
    log "Docker is available and running"
}

check_dependencies() {
    local deps=("curl" "jq" "git")
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            error "Required dependency '$dep' is not installed"
            exit 1
        fi
    done
    
    log "All dependencies are available"
}

health_check() {
    local url="$1"
    local max_attempts=30
    local attempt=1
    
    log "Performing health check on $url"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url/health" > /dev/null; then
            log "Health check passed on attempt $attempt"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    error "Health check failed after $max_attempts attempts"
    return 1
}

# =============================================================================
# 🗄️ BACKUP FUNCTIONS
# =============================================================================

create_backup() {
    if [ "$SKIP_BACKUP" = true ]; then
        warn "Skipping backup as requested"
        return 0
    fi
    
    log "Creating backup of current deployment..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "/var/backups/wat-backend"
    
    # Stop current container and create backup
    if docker ps | grep -q "wat-backend-"; then
        docker stop $(docker ps -q --filter "name=wat-backend-") || true
        
        # Export container if needed
        BACKUP_FILE="/var/backups/wat-backend/backup_${TIMESTAMP}.tar"
        docker export $(docker ps -aq --filter "name=wat-backend-") > "$BACKUP_FILE"
        
        log "Backup created: $BACKUP_FILE"
    fi
}

# =============================================================================
# 🐳 DEPLOYMENT FUNCTIONS
# =============================================================================

deploy_staging() {
    log "Starting staging deployment..."
    
    local image_tag="${IMAGE_TAG:-ghcr.io/vcern/wat-backend:staging}"
    
    # Pull latest image
    docker pull "$image_tag"
    
    # Stop and remove existing staging container
    docker stop wat-backend-staging || true
    docker rm wat-backend-staging || true
    
    # Start new staging container
    docker run -d \
        --name wat-backend-staging \
        --restart unless-stopped \
        -p 3001:3000 \
        --env-file /home/deploy/.env.staging \
        --network wat-network \
        "$image_tag"
    
    # Wait and perform health check
    sleep 30
    if health_check "http://localhost:3001"; then
        log "Staging deployment successful!"
    else
        error "Staging deployment failed health check"
        return 1
    fi
}

deploy_production() {
    log "Starting production deployment with blue-green strategy..."
    
    local image_tag="${IMAGE_TAG:-ghcr.io/vcern/wat-backend:production}"
    
    # Pull latest image
    docker pull "$image_tag"
    
    # Determine current and next colors
    if docker ps --format "table {{.Names}}" | grep -q "wat-backend-blue"; then
        CURRENT="blue"
        NEXT="green"
        CURRENT_PORT=3000
        NEXT_PORT=3001
    else
        CURRENT="green"
        NEXT="blue"
        CURRENT_PORT=3001
        NEXT_PORT=3000
    fi
    
    log "Current: $CURRENT ($CURRENT_PORT), Next: $NEXT ($NEXT_PORT)"
    
    # Stop and remove next container if exists
    docker stop "wat-backend-$NEXT" || true
    docker rm "wat-backend-$NEXT" || true
    
    # Start next container
    docker run -d \
        --name "wat-backend-$NEXT" \
        --restart unless-stopped \
        -p "$NEXT_PORT:3000" \
        --env-file /home/deploy/.env.production \
        --network wat-network \
        "$image_tag"
    
    # Wait for startup
    sleep 45
    
    # Health check new container
    if ! health_check "http://localhost:$NEXT_PORT"; then
        error "New container health check failed, cleaning up..."
        docker stop "wat-backend-$NEXT"
        docker rm "wat-backend-$NEXT"
        return 1
    fi
    
    # Update nginx to point to new container
    if [ -f "/etc/nginx/sites-available/wat-api" ]; then
        sudo sed -i "s/127.0.0.1:$CURRENT_PORT/127.0.0.1:$NEXT_PORT/g" /etc/nginx/sites-available/wat-api
        sudo nginx -t && sudo systemctl reload nginx
        
        log "Nginx configuration updated and reloaded"
    fi
    
    # Wait for switch to take effect
    sleep 10
    
    # Stop old container
    docker stop "wat-backend-$CURRENT" || true
    docker rm "wat-backend-$CURRENT" || true
    
    log "Production deployment successful! Active: $NEXT"
}

# =============================================================================
# 🧹 CLEANUP FUNCTIONS
# =============================================================================

cleanup_old_images() {
    log "Cleaning up old Docker images..."
    
    # Keep only the last 3 images
    docker images ghcr.io/vcern/wat-backend --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | \
        tail -n +4 | awk '{print $2}' | xargs -r docker rmi || true
    
    # Remove dangling images
    docker image prune -f
    
    log "Image cleanup completed"
}

# =============================================================================
# 📊 MONITORING FUNCTIONS
# =============================================================================

show_status() {
    echo -e "${BLUE}=============================================================================${NC}"
    echo -e "${BLUE}📊 DEPLOYMENT STATUS${NC}"
    echo -e "${BLUE}=============================================================================${NC}"
    
    echo -e "\n${CYAN}🐳 Docker containers:${NC}"
    docker ps --filter "name=wat-backend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo -e "\n${CYAN}📈 Container logs (last 10 lines):${NC}"
    for container in $(docker ps -q --filter "name=wat-backend"); do
        container_name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/^.//')
        echo -e "\n${YELLOW}--- $container_name ---${NC}"
        docker logs --tail 10 "$container"
    done
    
    echo -e "\n${CYAN}💾 Disk usage:${NC}"
    df -h /var/lib/docker
    
    echo -e "${BLUE}=============================================================================${NC}"
}

# =============================================================================
# 📋 MAIN EXECUTION
# =============================================================================

main() {
    # Parse command line arguments
    while [[ $# -gt 1 ]]; do
        case $2 in
            --force)
                FORCE_DEPLOY=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --status)
                show_status
                exit 0
                ;;
            *)
                error "Unknown option: $2"
                exit 1
                ;;
        esac
    done
    
    print_banner
    
    # Pre-flight checks
    check_dependencies
    check_docker
    
    if [ "$DRY_RUN" = true ]; then
        log "DRY RUN MODE - No actual deployment will occur"
        log "Would deploy to environment: $ENVIRONMENT"
        exit 0
    fi
    
    # Confirmation prompt (unless forced)
    if [ "$FORCE_DEPLOY" != true ]; then
        echo -e "${YELLOW}Are you sure you want to deploy to $ENVIRONMENT? (y/N)${NC}"
        read -r confirmation
        if [[ ! "$confirmation" =~ ^[Yy]$ ]]; then
            log "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    # Create backup
    create_backup
    
    # Deploy based on environment
    case "$ENVIRONMENT" in
        staging)
            deploy_staging
            ;;
        production)
            deploy_production
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT (use 'staging' or 'production')"
            exit 1
            ;;
    esac
    
    # Cleanup old resources
    cleanup_old_images
    
    # Show final status
    show_status
    
    log "🎉 Deployment to $ENVIRONMENT completed successfully!"
}

# =============================================================================
# 🎯 HELP FUNCTION
# =============================================================================

show_help() {
    echo -e "${CYAN}WAT Backend Deployment Script${NC}"
    echo ""
    echo "Usage: $0 [staging|production] [options]"
    echo ""
    echo "Environments:"
    echo "  staging     Deploy to staging environment"
    echo "  production  Deploy to production environment (default)"
    echo ""
    echo "Options:"
    echo "  --force         Skip confirmation prompt"
    echo "  --skip-backup   Skip creating backup before deployment"
    echo "  --dry-run       Show what would be done without executing"
    echo "  --status        Show current deployment status and exit"
    echo "  --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 staging"
    echo "  $0 production --force"
    echo "  $0 staging --skip-backup --dry-run"
    echo "  $0 --status"
}

# Check for help flag
if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    show_help
    exit 0
fi

# Run main function
main "$@"
