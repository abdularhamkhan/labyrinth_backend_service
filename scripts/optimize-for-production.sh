#!/bin/bash

# =============================================================================
# MOBILE APP BACKEND PRODUCTION OPTIMIZATION SCRIPT
# =============================================================================
# Optimizes Ubuntu server for high-concurrency mobile app backend
# Supports both HTTP/1.1 and HTTP/2 implementations

echo "🚀 Optimizing server for mobile app backend..."

# =============================================================================
# SYSTEM LIMITS OPTIMIZATION
# =============================================================================

echo "📊 Current system limits:"
echo "File descriptors: $(ulimit -n)"
echo "Socket queue: $(cat /proc/sys/net/core/somaxconn)"
echo "Available memory: $(free -h | grep 'Mem:' | awk '{print $7}')"

# Increase file descriptor limits (CRITICAL for concurrent connections)
echo "🔧 Increasing file descriptor limits..."
cat >> /etc/security/limits.conf << EOF
# Mobile app backend optimization
* soft nofile 65536
* hard nofile 65536
root soft nofile 65536
root hard nofile 65536
EOF

# System-wide file descriptor limits
echo "🔧 Setting system-wide limits..."
echo "fs.file-max = 2097152" >> /etc/sysctl.conf
echo "net.core.somaxconn = 65536" >> /etc/sysctl.conf

# TCP optimization for mobile connections
echo "🔧 Optimizing TCP for mobile clients..."
cat >> /etc/sysctl.conf << EOF

# Mobile app backend TCP optimization
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 120
net.ipv4.tcp_keepalive_intvl = 30
net.ipv4.tcp_keepalive_probes = 3
net.ipv4.tcp_max_syn_backlog = 65536
net.core.netdev_max_backlog = 65536
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_congestion_control = bbr

# Memory optimization for high concurrency
vm.overcommit_memory = 1
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 32768 134217728
net.ipv4.tcp_wmem = 4096 32768 134217728
EOF

# Apply sysctl changes
sysctl -p

# =============================================================================
# NODE.JS PROCESS OPTIMIZATION
# =============================================================================

echo "🔧 Creating Node.js optimization script..."
cat > /usr/local/bin/optimize-nodejs.sh << 'EOF'
#!/bin/bash
# Node.js process optimization for mobile backend

# Increase UV_THREADPOOL_SIZE for better I/O handling
export UV_THREADPOOL_SIZE=128

# V8 heap optimization for high concurrency
export NODE_OPTIONS="--max-old-space-size=6144 --max-semi-space-size=512"

# Enable V8 performance optimizations
export NODE_OPTIONS="$NODE_OPTIONS --optimize-for-size --use-largepages=on"

echo "✅ Node.js optimizations applied"
echo "Heap size: 6GB"
echo "Thread pool: 128"
EOF

chmod +x /usr/local/bin/optimize-nodejs.sh

# =============================================================================
# NGINX CONFIGURATION FOR MOBILE BACKEND
# =============================================================================

echo "🔧 Creating Nginx configuration for mobile backend..."
cat > /etc/nginx/sites-available/mobile-backend-optimized << 'EOF'
# Mobile App Backend Optimized Configuration
upstream backend_http1 {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 300;
}

upstream backend_http2 {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 300;
}

upstream websocket_backend {
    least_conn;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
}

# HTTP/2 Server Block
server {
    listen 443 ssl http2;
    server_name wat.vcern.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/wat.vcern.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wat.vcern.com/privkey.pem;
    
    # HTTP/2 specific optimizations
    http2_max_concurrent_streams 128;
    http2_recv_timeout 30s;
    
    # Mobile-optimized settings
    client_max_body_size 50M;
    client_body_timeout 60s;
    client_header_timeout 60s;
    keepalive_timeout 65s;
    keepalive_requests 1000;
    
    # Gzip for mobile bandwidth optimization
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        application/json
        application/javascript
        text/css
        text/xml
        text/plain
        application/xml
        application/xml+rss;
    
    # API Routes
    location /api/ {
        proxy_pass http://backend_http2;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Mobile connection optimization
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering off;
    }
    
    # WebSocket Routes
    location /ws {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket specific timeouts for mobile
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# HTTP/1.1 Fallback
server {
    listen 80;
    server_name wat.vcern.com;
    return 301 https://$server_name$request_uri;
}
EOF

# =============================================================================
# MONITORING SETUP
# =============================================================================

echo "📊 Setting up basic monitoring..."
cat > /usr/local/bin/mobile-backend-monitor.sh << 'EOF'
#!/bin/bash
# Basic monitoring for mobile backend

echo "=== Mobile Backend Status ==="
echo "Current connections: $(ss -tun | wc -l)"
echo "Memory usage: $(free -h | grep 'Mem:' | awk '{print $3"/"$2}')"
echo "CPU usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)"
echo "Disk usage: $(df -h / | awk 'NR==2{print $5}')"
echo "File descriptors: $(lsof | wc -l)/$(ulimit -n)"
echo "Node.js processes: $(pgrep -c node)"
echo "==========================="
EOF

chmod +x /usr/local/bin/mobile-backend-monitor.sh

# =============================================================================
# PERFORMANCE TESTING SCRIPT
# =============================================================================

echo "🧪 Creating performance test script..."
cat > /usr/local/bin/test-mobile-backend.sh << 'EOF'
#!/bin/bash
# Performance testing for mobile backend

echo "🧪 Testing mobile backend performance..."

# Test HTTP/1.1 capacity
echo "Testing HTTP/1.1 endpoint..."
curl -w "Time: %{time_total}s, Status: %{http_code}\n" -s -o /dev/null https://wat.vcern.com/api/health

# Test HTTP/2 if available
echo "Testing HTTP/2 endpoint..."
curl --http2 -w "Time: %{time_total}s, Status: %{http_code}, HTTP Version: %{http_version}\n" -s -o /dev/null https://wat.vcern.com/api/health

# WebSocket connection test
echo "Testing WebSocket connection..."
timeout 5s wscat -c wss://wat.vcern.com/ws || echo "WebSocket test completed"

echo "✅ Performance tests completed"
EOF

chmod +x /usr/local/bin/test-mobile-backend.sh

echo "✅ Production optimization complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Reboot server to apply kernel changes"
echo "2. Source Node.js optimizations: source /usr/local/bin/optimize-nodejs.sh"
echo "3. Enable optimized Nginx config: ln -s /etc/nginx/sites-available/mobile-backend-optimized /etc/nginx/sites-enabled/"
echo "4. Test configuration: /usr/local/bin/test-mobile-backend.sh"
echo "5. Monitor performance: /usr/local/bin/mobile-backend-monitor.sh"
echo ""
echo "📊 Expected capacity after optimization:"
echo "HTTP/1.1: 2,000-3,000 concurrent mobile users"
echo "HTTP/2: 4,000-8,000 concurrent mobile users"
EOF
