---
description: Guide for setting up the project for production deployment
---

# Production Setup

This guide provides instructions for setting up the Mono Next Nest Template project for production deployment. It covers both backend and frontend setup processes.

## Backend Setup

1. Navigate to the server directory:
   ```bash
   cd apps/server
   ```

2. Set up production environment variables:
   ```bash
   cp .env.example .env.production.local
   ```
   
   :::warning
   Edit the `.env.production.local` file and set appropriate production values for all environment variables.
   :::

3. Build the backend:
   ```bash
   pnpm run build
   pnpm run build:dto # Build DTOs for the frontend
   ```

4. Apply and seed production database migrations:
   ```bash
   pnpm run db-migrate:prod
   pnpm run db-seed:prod
   ```

5. Start the production server:
   ```bash
   pnpm run start:prod
   ```

## Frontend Setup

1. Navigate to the web directory:
   ```bash
   cd apps/web
   ```

2. Set up production environment variables:
   ```bash
   cp .env.example .env.production.local
   ```

   :::warning
   Edit the `.env.production.local` file and set appropriate production values for all environment variables.
   :::

3. Build the frontend:
   ```bash
   pnpm run build
   ```

4. Start the production frontend server:
   ```bash
   pnpm run start
   ```

:::warning
Ensure you edit the `.env.production.local` files in both `apps/server` and `apps/web` directories with the appropriate production values before building.

`.env.production.local` is needed for building Next.js, as it runs some files that perform environment validation. If this file is not present, the build will fail.
:::
