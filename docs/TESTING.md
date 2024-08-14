# Testing Guide

This document provides detailed information about our testing setup, processes, and philosophy for the project.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Continuous Integration](#continuous-integration)
6. [Troubleshooting](#troubleshooting)

## Testing Philosophy

TODO: In another branch give general testing phylosphy here an then for each app (next, next), for each domain (component, hooks, reository layer, controller layer, ...) explain how to test as well as the utilities

## Backend Testing

### Setup

1. Navigate to the server directory:
   ```sh
   cd apps/server
   ```

2. Set up the test environment:
   ```sh
   cp .env.example .env.test.local
   ```
   Edit `.env.test.local` and change the `DATABASE_URL` to use a test database (e.g., `test_db`).

3. Migrate the test database:
   ```sh
   pnpm run db-migrate:test
   ```

### Running Tests

- Unit tests: `pnpm run test`
- E2E tests: `pnpm run test:e2e`

### Writing Tests

TODO: in the another branch for extensive doc, check if this section fit, and fill it with greate details.

## Frontend Testing

### Setup

1. Navigate to the web directory:
   ```sh
   cd apps/web
   ```

### Running Tests

- Unit tests: `pnpm run test`

### Writing Tests

TODO: in the another branch for extensive doc, check if this section fit, and fill it with greate details.

## End-to-End Testing

We use Playwright for end-to-end testing, aiming to simulate a production-like environment for more accurate and reliable tests.

### Setup

1. Verify production environment setup:
   Ensure that `.env.production.local` files exist in both the `apps/server` and `apps/web` directories. 

   Note: Proper production setup is required before running frontend E2E tests. If these files are missing or you're unsure about their contents, please refer to the [Production Setup Guide](PRODUCTION_SETUP.md) and complete the setup process before proceeding.

2. Build the backend and frontend:
   ```sh
   cd apps/server
   pnpm run build
   pnpm run build:dto
   cd ../web
   pnpm run build

3. Install Playwright:
   ```sh
   pnpm exec playwright install
   ```

### Running E2E Tests

- Run E2E tests: `pnpm run test:e2e`
- Run with UI: `pnpm run test:e2e:ui`

Note: E2E tests use the production build of both frontend and backend, and connect to the production database. This approach ensures our tests are as close as possible to the real production environment.

### Writing E2E Tests

TODO: in the another branch for extensive doc, check if this section fit, and fill it with greate details.

## Continuous Integration

TODO: verify this section and complete it.

Our CI pipeline runs all tests for every push and pull request. See the [CI/CD section](README.md#ci-cd) in the main README for more details.

## Troubleshooting

### 409 Conflict Error

If you encounter a 409 Conflict error, it usually means a previous test failed to clean up properly. To resolve:

1. Manually delete the conflicting user from the database, or
2. Re-run the E2E tests in terminal mode: `pnpm test:e2e`

### "Error reading storage state" in E2E UI Mode

If tests fail due to "Error reading storage state" or inability to find a username locator:

1. Run the setup test alone first
2. This logs in testUser and tetris, storing authentication cookies for all tests
3. Then run the remaining tests

### Timeout Issues with Protected Route Tests

Sometimes, tests (especially those involving protected routes) may time out unexpectedly. While the root cause is still under investigation, here's the current troubleshooting step:

1. Rerun the test at least 3 times:
   If a test fails due to a timeout, try running it multiple times. Often, the issue resolves itself after a few attempts.

For any other issues, please open an issue in the project repository.