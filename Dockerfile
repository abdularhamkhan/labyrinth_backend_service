FROM ubuntu:24.04

LABEL version="2.0.0"
LABEL description="Labyrinth Collaboration Platform - Railway Optimized"
LABEL maintainer="Labyrinth Team - FAST NUCES"

ENV NODE_ENV=production
ENV DEBIAN_FRONTEND=noninteractive
ENV PORT=${PORT:-3000}

# Install Node.js 20.x and system deps
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    postgresql-client \
    build-essential \
    python3 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy prisma schema BEFORE installing deps (critical!)
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma Client during build
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Keep Prisma client - DO NOT prune @prisma/client
# npm prune would remove generated client

EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start the server (Prisma client already generated)
CMD ["npm", "start"]