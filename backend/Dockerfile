FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate && npm run build

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app
RUN \
  addgroup --system app-group && \
  adduser --system --home /home/app app && \
  chown -R app:app-group /home/app

COPY --from=builder /app/dist ./dist
COPY --from=builder --chown=app:app-group /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder --chown=app:app-group /app/prisma/migrations ./prisma/migrations
COPY --from=builder --chown=app:app-group /app/node_modules ./node_modules

USER app
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]