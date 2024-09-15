---
description: Guide for running tests and setting up the testing environment
---

# Testing

This document provides detailed information about how to run tests for the project.

## Backend Testing

### Setup

1. Navigate to the server directory:
   ```bash
   cd apps/server
   ```

2. Set up the test environment:
   ```bash
   cp .env.example .env.test.local
   ```
   :::caution
   Edit `.env.test.local` and change the `DATABASE_URL` to use a test database (e.g., `test_db`).
   :::

3. Migrate the test database:
   ```bash
   pnpm run db-migrate:test
   ```

### Running Tests

- Unit tests: `pnpm run test`
- E2E tests: `pnpm run test:e2e`

## Frontend Testing

### Setup

1. Navigate to the web directory:
   ```bash
   cd apps/web
   ```

### Running Tests

- Unit tests: `pnpm run test`

## End-to-End Testing

We use Playwright for end-to-end testing, aiming to simulate a production-like environment for more accurate and reliable tests.

### Setup

1. Verify production environment setup:
   Ensure that `.env.production.local` files exist in both the `apps/server` and `apps/web` directories. 

   :::info
   Proper production setup is required before running frontend E2E tests. If these files are missing or you're unsure about their contents, please refer to the [Production Setup Guide](./production-setup.md) and complete the setup process before proceeding.
   :::

2. Build the backend and frontend:
   ```bash
   cd apps/server
   pnpm run build
   cd ../web
   pnpm run build
   ```

3. Install Playwright:
   ```bash
   pnpm exec playwright install
   ```

### Running E2E Tests

- Run E2E tests: `pnpm run test:e2e`
- Run with UI: `pnpm run test:e2e:ui`

:::tip
E2E tests use the production build of both frontend and backend, and connect to the production database. This approach ensures the tests are as close as possible to the real production environment.
:::

## Continuous Integration

This project uses GitLab CI/CD for continuous integration. For detailed information about the CI pipeline, including stages, environment setup, and notes on Docker builds, please refer to the [CI documentation](./continuous-integration.md).

## Troubleshooting

<details>
<summary>409 Conflict Error</summary>

If you encounter a 409 Conflict error, it usually means a previous test failed to clean up properly. To resolve:

1. Manually delete the conflicting user from the database, or
2. Re-run the E2E pnpm script command: `pnpm test:e2e` or `pnpm test:e2e:ui` they should run a script in the backend that reset the databases;
3. Or direclty run the command in the backend: `pnpm run db-seed:force:prod`
</details>

<details>
<summary>"Error reading storage state" in E2E UI Mode</summary>

If tests fail due to "Error reading storage state" or inability to find a username locator:

1. Run the setup test alone first (this test is normaly automatically run in terminal mode)
2. This logs in testUser and tetris, storing authentication cookies for all tests
3. Then run the remaining tests
</details>

<details>
<summary>Protected route error because of timeout</summary>

The root cause is still under investigation, but as a workaround you can just retry the test, either in terminal or ui mode.
In CI, the test retries at least 3 times, so they mostly passes.
</details>

:::info
For any other issues, please open an issue in the project repository.
:::