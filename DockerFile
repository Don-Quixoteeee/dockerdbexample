# Multi-stage build for Next.js standalone output

########################
# Builder Stage
########################
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (use lockfile when present)
COPY package*.json ./
RUN npm ci

# Build the app (standalone output)
COPY . .
RUN npm run build

########################
# Production Stage
########################
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only the standalone artifacts and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Run the standalone server
CMD ["node", "server.js"]
