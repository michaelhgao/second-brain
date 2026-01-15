#!/bin/bash

cd "$(dirname "$0")/../second-brain-backend"

docker-compose down
docker-compose up --build

