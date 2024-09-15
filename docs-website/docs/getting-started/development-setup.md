---
description: Guide for setting up the development environment for both backend and frontend
---

# Development Setup

This guide walks you through setting up the development environment for both the backend and frontend of the project.

## Backend Setup

<details>
<summary>Step-by-step backend setup</summary>

1. Navigate to the server directory:
   ```bash
   cd apps/server
   ```

2. Set up environment variables:
   - Copy the example environment file:
     ```bash
     cp .env.example .env.development.local
     ```
   - Open `.env.development.local` and adjust the values as needed for your local development environment.

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up the database:
   - Ensure your database server is running. See the [Docker Compose Development](#docker-compose-development) section for details on setting up the database using Docker.
   - Run migrations to generate Prisma types and apply the schema to the database:
     ```bash
     pnpm db-migrate
     ```
   - Seed the dev database:
     ```bash
     pnpm db-seed
     ```

   You can check the seeded data using Prisma Studio:
   ```bash
   pnpm db-studio
   ```

5. Start the development server:
   ```bash
   pnpm run dev
   ```

6. The backend server should now be running. You can access the API documentation at `http://localhost:4000/api` (adjust the port if you've changed it in your environment variables).

:::tip
For instructions on how to test the server, login, and API using Swagger, please refer to the [API Testing Guide](./api-testing.md).
:::

</details>

## Frontend Setup

<details>
<summary>Step-by-step frontend setup</summary>

1. Navigate to the web directory:
   ```bash
   cd apps/web
   ```

2. Set up environment variables:
   - Copy the example environment file:
     ```bash
     cp .env.example .env.development.local
     ```
   - Open `.env.development.local` and adjust the values as needed for your local development environment.

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

6. The frontend development server should now be running. You can access it at `http://localhost:3000` (adjust the port if you've changed it in your environment variables).

</details>

## Docker Compose Development

To set up the development environment using Docker Compose:

1. From the root of the project directory, start the Docker Compose services:
   ```bash
   pnpm compose:dev
   ```

This command starts a PostgreSQL database and pgAdmin, a web-based database management tool.

For detailed instructions on using pgAdmin and other Docker-related configurations, please refer to the [Docker Development Guide](./setup-docker-dev.md).

## Accessing the Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- API Documentation (Swagger): `http://localhost:4000/api`

:::caution
Remember to replace the ports if you've configured different ones in your environment variables.
:::