# Image Building Guide

This guide explains how to build and push Docker images for the project.

## Base Image

The base image is a Node.js 20 image with the latest OpenSSL for Prisma, dotenv-cli, and pnpm installed.

### Building and Pushing New Version
```sh
pnpm build-and-push:base
```
This builds for multiple architectures (check the npm script) and pushes to the GitLab registry.
Note: This image should not be pushed frequently as it is not expected to change often.

## Playwright Image

```sh
pnpm build:playwright
```
This builds a custom Playwright image for multiple architectures and pushes it to the GitLab registry.
It is used to run the Playwright tests in the GitLab CI.

## Application Images

### Building Locally
See [local deployment guide](DEPLOYMENT.md) for details.

### Building and Pushing for Production
```sh
pnpm build-and-push:prod
```
This runs a script that automates building and pushing Docker images for Nest, Next.js, and Prisma services.

Key features:
- Builds project app images separately
- Pushes images to GitLab container registry
- Tags images as 'latest' and with current commit SHA

Prerequisites:
* The base image must be built and available either localy or from the registry.

When to use:
Run this from the main branch when pushing a new stable version of the apps.
Note: The script will warn if not on the main branch, but allows override.

## Prerequisites for Multi-Platform Builds

Before building multi-platform images, ensure you have set up Docker BuildX:

```sh
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap
```

Also, make sure you're logged into your registry (in this case, GitLab registry):

```sh
docker login registry.gitlab.com
```