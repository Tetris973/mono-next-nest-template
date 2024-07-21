#!/bin/bash

set -e

REGISTRY="registry.gitlab.com/tetris973/mono-next-nest-template"
SERVICES=("nest" "next" "prisma-migrate")
COMPOSE_FILE="docker/production/docker-compose.yml"
BUILD_ALL=false


# ANSI color codes
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if on main branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
    echo -e "${YELLOW}WARNING: You are not on the main branch. Current branch: $current_branch${NC}"
    echo -e "${YELLOW}This script is intended to be run from the main branch.${NC}"
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operation cancelled."
        exit 1
    fi
fi

COMMIT_SHA=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)
COMMIT_AUTHOR=$(git log -1 --pretty=format:'%an <%ae>')
COMMIT_DATE=$(git log -1 --pretty=format:'%ad' --date=format:'%Y-%m-%d %H:%M:%S')

echo "Current commit details:"
echo "  SHA: $COMMIT_SHA"
echo "  Message: $COMMIT_MSG"
echo "  Author: $COMMIT_AUTHOR"
echo "  Date: $COMMIT_DATE"
echo ""

# Ask all questions upfront
read -p "Do you want to build images? (y/n/all) " -n 1 -r
echo
if [[ $REPLY =~ ^[Aa]$ ]]; then
    DO_BUILD=true
    BUILD_ALL=true
    BUILD_SERVICES="${SERVICES[*]}"
elif [[ $REPLY =~ ^[Yy]$ ]]; then
    DO_BUILD=true
    for service in "${SERVICES[@]}"; do
        read -p "Do you want to build $service? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            BUILD_SERVICES="$BUILD_SERVICES $service"
        fi
    done
else
    DO_BUILD=false
fi

read -p "Do you want to push images? (y/n/all) " -n 1 -r
echo
if [[ $REPLY =~ ^[Aa]$ ]]; then
    DO_PUSH=true
    PUSH_ALL=true
    PUSH_SERVICES="${SERVICES[*]}"
elif [[ $REPLY =~ ^[Yy]$ ]]; then
    DO_PUSH=true
    for service in "${SERVICES[@]}"; do
        read -p "Do you want to push $service? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            PUSH_SERVICES="$PUSH_SERVICES $service"
        fi
    done
else
    DO_PUSH=false
fi

echo "Starting operations..."

# Build stage
if [ "$DO_BUILD" = true ]; then
    export DOCKER_DEFAULT_PLATFORM=linux/amd64
    if [ "$BUILD_ALL" = true ]; then
        echo "Building all services..."
        BUILD_PLATFORM=linux/amd64 docker compose -f $COMPOSE_FILE build
    else
        for service in $BUILD_SERVICES; do
            echo "Building $service..."
            BUILD_PLATFORM=linux/amd64 docker compose -f $COMPOSE_FILE build $service
            echo "$service built successfully."
        done
    fi
else
    echo "Skipping build stage."
fi

# Push stage
if [ "$DO_PUSH" = true ]; then
    if [ "$PUSH_ALL" = true ]; then
        for service in "${SERVICES[@]}"; do
            if docker image inspect $REGISTRY/$service:latest >/dev/null 2>&1; then
                echo "Pushing $service..."
                # Tag with commit SHA
                docker tag $REGISTRY/$service:latest $REGISTRY/$service:$COMMIT_SHA
                # Push both tags
                docker push $REGISTRY/$service:latest
                docker push $REGISTRY/$service:$COMMIT_SHA
                echo "$service pushed successfully."
            else
                echo "Image for $service not found. Skipping."
            fi
        done
    else
        for service in $PUSH_SERVICES; do
            if docker image inspect $REGISTRY/$service:latest >/dev/null 2>&1; then
                echo "Pushing $service..."
                # Tag with commit SHA
                docker tag $REGISTRY/$service:latest $REGISTRY/$service:$COMMIT_SHA
                # Push both tags
                docker push $REGISTRY/$service:latest
                docker push $REGISTRY/$service:$COMMIT_SHA
                echo "$service pushed successfully."
            else
                echo "Image for $service not found. Skipping."
            fi
        done
    fi
else
    echo "Skipping push stage."
fi

echo "Script completed."