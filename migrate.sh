#!/bin/sh
set -e

npx prisma migrate deploy

# Seed once when RUN_SEED=true (the seed itself is idempotent).
if [ "$RUN_SEED" = "true" ]; then
  npm run db:seed
fi
