FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app

# Install turbo
RUN npm install -g turbo

# Copy monorepo config
COPY package.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Build
RUN turbo run build --filter=api

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 8000
CMD ["npm", "start"]
