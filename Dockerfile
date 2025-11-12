# syntax=docker/dockerfile:1.7

# -------- Builder --------
FROM node:20-bookworm AS builder
WORKDIR /app

# Install pnpm
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies and build
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js
RUN pnpm build

# -------- Runtime --------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# Install ca-certificates for HTTPS requests to latexonline.cc
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Create non-root user
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs

# Install pnpm in runtime
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Copy package files and install production dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --prod --frozen-lockfile

# Copy built app from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create necessary directories and set permissions
RUN mkdir -p /app/.next/cache /tmp && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]


