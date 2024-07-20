#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

>&2 echo "Postgres is up - executing command"

# Deploy latest archtitecture changes to database
npx prisma migrate deploy --schema dist/prisma/schema.prisma

if [ "$PRISMA_SEED" = "true" ]; then
  # Seed all static data
  npx node dist/prisma/seeding/production/all.seed.js
fi

# Execute any additional command passed to the entrypoint
exec "$@"