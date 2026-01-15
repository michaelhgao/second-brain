#!/bin/bash

export $(grep -v '^#' .env | xargs)

echo "Starting PostgreSQL..."
docker-compose up -d

echo "Waiting for Postgres to be ready..."
until docker exec $(docker-compose ps -q db) pg_isready -U $POSTGRES_USER -d $POSTGRES_DB > /dev/null 2>&1; do
    sleep 1
done
echo "Postgres is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting backend..."
npm run dev
