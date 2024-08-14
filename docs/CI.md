# Continuous Integration (CI)

This project uses GitLab CI for automated testing and building.

## Pipeline Overview

1. Install: Installs dependencies
2. Lint: Runs linters for both backend and frontend
3. Build: Builds both backend and frontend (frontend requires backend DTOs)
4. Test: Executes unit and E2E tests for both backend and frontend
5. Docker (currently commented out): Builds production Docker images, tags them as 'latest' and with the current commit SHA, and pushes them to the registry. This stage only runs when merging to the main branch.

Key features:
- Uses custom Node image with pre-installed dependencies
- Runs on a PostgreSQL service for database-dependent tests
- Uses a custom Playwright image for frontend E2E tests
- Frontend E2E tests run both backend and frontend in production mode

Note: The Docker build stage is currently commented out due to issues with custom runners (Docker-in-Docker configuration). It can be used with GitLab shared runners by uncommenting the relevant section in the `.gitlab-ci.yml` file. Alternatively, follow the manual image building process described in [Image Building Guide](IMAGE_BUILDING.md).

## Environment Setup

The pipeline requires several environment variables and files to be set in GitLab CI/CD settings:

- `POSTGRES_SERVICE_DB`, `POSTGRES_SERVICE_USER`, `POSTGRES_SERVICE_PASSWORD`: For PostgreSQL service configuration
- `NEST_ENV_FILE`: Environment file for NestJS backend
- `NEXT_ENV_FILE`: Environment file for Next.js frontend
- `DOCKER_NEST_ENV_FILE`, `DOCKER_NEXT_ENV_FILE`, `DOCKER_PRISMA_MIGRATE_ENV_FILE`, `DOCKER_POSTGRES_ENV_FILE`: Environment files for Docker image building (when using the Docker stage)

For detailed job configurations and scripts, refer to the `.gitlab-ci.yml` file in the project root.