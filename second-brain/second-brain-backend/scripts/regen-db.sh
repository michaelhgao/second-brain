#!/bin/bash

cd "$(dirname "$0")/../second-brain-backend"

docker-compose exec backend npx prisma migrate dev --name init
npx prisma generate