#!/bin/bash

cd "$(dirname "$0")/../second-brain-backend"

docker-compose down
docker-compose up --build

echo "Waiting for Postgres to be ready..."
until docker exec second-brain-db pg_isready -U $POSTGRES_USER >/dev/null 2>&1; do
  echo -n "."
  sleep 2
done
echo "Postgres is ready!"

echo "Running Prisma migrations..."
docker exec second-brain-backend npx prisma migrate deploy
docker exec second-brain-backend npx prisma generate

docker logs -f second-brain-backend

