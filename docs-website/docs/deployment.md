---
description: This guide provides detailed information about how to deploy the application.
sidebar_position: 7
---

# Deploy the Application

This document provides detailed information about deploying the application both locally and on a production server.

## Local Deployment

### Building Docker Images Locally

1. Build the base image for your local architecture:

```bash
pnpm build:base
```

:::info
This command builds the image with the same tag as the remote image, but only for your local architecture.
:::

2. Configure environment files:

In the `docker/production` directory, create the following `.env` files based on the `.env.example`:

- `.env.postgres`
- `.env.nest`
- `.env.next`
- `.env.prisma-migrate`

3. Build the application images:

```bash
pnpm build:prod
```

### Starting Local Deployment

From the root directory, start all the apps:

```bash
pnpm compose:prod
```

This will start a production-like environment on your local machine.

## Production Server Deployment

### Building Images for Server Deployment

For building images for server deployment, refer to the [Image Building Guide](image-building.md).

### Server Setup

1. Copy the following files from `docker/production` to your server:
   - `docker-compose.yml`
   - `prisma-migrate.entrypoint.sh`

2. Create the required `.env` files on the server:
   - `.env.postgres`
   - `.env.nest`
   - `.env.next`
   - `.env.prisma-migrate`

:::caution
For better security, avoid hardcoding values in these files. Use environment variables and pass them securely when running Docker Compose.
:::

3. Verify that all required images are available in your GitLab registry.

4. Log in to your GitLab registry on the server:

```bash
docker login registry.gitlab.com
```

### Starting the Application on the Server

In the folder containing the `docker-compose.yml` and `.env` files, run:

```bash
docker compose up -d
```

This will pull the necessary images and start your application in detached mode.

## Additional Notes

:::warning
- Ensure all required environment variables are properly set before starting the application.
- For production deployments, consider using a secure method to manage and inject environment variables. (TODO: find and document one)
:::

:::info
Remember to configure your server's firewall, set up any necessary reverse proxies, and implement proper logging and monitoring solutions. (TODO: Documentation to be done in another project for server setup, with reverse proxy nginx, gitlab runners, certificate, ...)
:::