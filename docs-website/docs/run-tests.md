---
description: This guide provides detailed information about how to run tests for the project.
sidebar_position: 4
---

# Run Tests

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
   Proper production setup is required before running frontend E2E tests. If these files are missing or you're unsure about their contents, please refer to the [Production Setup Guide](./README.mdx#production-setup) and complete the setup process before proceeding.
   :::

2. Build the backend and frontend:
   ```bash
   cd apps/server
   pnpm run build
   pnpm run build:dto
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
E2E tests use the production build of both frontend and backend, and connect to the production database. This approach ensures our tests are as close as possible to the real production environment.
:::

## Continuous Integration

:::warning
TODO: verify this section and complete it.
:::

Our CI pipeline runs all tests for every push and pull request. See the [CI section](README.mdx#continuous-integration) in the main README for more details.

## Troubleshooting

<details>
<summary>409 Conflict Error</summary>

If you encounter a 409 Conflict error, it usually means a previous test failed to clean up properly. To resolve:

1. Manually delete the conflicting user from the database, or
2. Re-run the E2E tests in terminal mode: `pnpm test:e2e`
</details>

<details>
<summary>"Error reading storage state" in E2E UI Mode</summary>

If tests fail due to "Error reading storage state" or inability to find a username locator:

1. Run the setup test alone first
2. This logs in testUser and tetris, storing authentication cookies for all tests
3. Then run the remaining tests
</details>

<details>
<summary>Timeout Issues with Protected Route Tests</summary>

Sometimes, tests (especially those involving protected routes) may time out unexpectedly. While the root cause is still under investigation, here's the current troubleshooting step:

1. Rerun the test at least 3 times:
   If a test fails due to a timeout, try running it multiple times. Often, the issue resolves itself after a few attempts.
</details>

:::info
For any other issues, please open an issue in the project repository.
:::