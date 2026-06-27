FROM node:22-alpine AS deps
WORKDIR /app
# Schema + config are needed because postinstall runs `prisma generate`.
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Placeholders so env validation passes during the build; real values are
# injected at runtime via the container environment.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV JWT_SECRET="build-time-placeholder-secret-change-me-32"
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
