---
description: This guide explains how to build and push Docker images for the project.
sidebar_position: 6
---

# Build Docker Images

This guide explains how to build and push Docker images for the project.

## Prerequisites for Multi-Platform Builds

:::info
Before building multi-platform images, ensure you have set up Docker BuildX:
:::

```bash
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap
```

Also, make sure you're logged into your registry (in this case, GitLab registry):

```bash
docker login registry.gitlab.com
```

## Base Image

The base image is a Node.js 20 image with the latest OpenSSL for Prisma, dotenv-cli, and pnpm installed.

### Building and Pushing New Version

```bash
pnpm build-and-push:base
```

:::caution
This builds for multiple architectures (check the npm script) and pushes to the GitLab registry.
Note: This image should not be pushed frequently as it is not expected to change often.
:::

## Playwright Image

```bash
pnpm build:playwright
```

This builds a custom Playwright image for multiple architectures and pushes it to the GitLab registry.
It is used to run the Playwright tests in the GitLab CI.

## Application Images

### Building Locally

See [local deployment guide](deployment.md) for details.

### Building and Pushing for Production

```bash
pnpm build-and-push:prod
```

This runs a script that automates building and pushing Docker images for Nest, Next.js, and Prisma services.

Key features:
- Builds project app images separately
- Pushes images to GitLab container registry
- Tags images as 'latest' and with current commit SHA



:::info Prerequisites
- The base image must be built and available either locally or from the registry.
:::

:::tip Usage
Run this command from the main branch when pushing a new stable version of the apps.
:::

:::caution
The script will warn if not on the main branch, but allows override. This is to prevent pushing too much images to the registry and consume resources.
:::