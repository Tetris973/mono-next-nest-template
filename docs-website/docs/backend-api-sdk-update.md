---
description: Guide for updating the backend API SDK
---

# Updating the Backend API SDK

The backend uses Swagger to document its API. A package is available to provide the generated client SDK from the genrated backend openapi.json schema.

## Update Process

1. Navigate to the SDK package directory:
   ```bash
   cd packages/backend-api-sdk
   ```

2. Generate the SDK:
   ```bash
   pnpm run generate
   ```
   This command generates the `openapi.json` schema in the backend and uses it to create the SDK.

   :::info
   To run the generate command, you must have completed the [backend development setup](./development-setup.md#backend-setup).
   :::

3. Update dependent packages:
   ```bash
   pnpm i
   ```
   Run this command in the root of the repository to update the SDK package in apps that use it, such as the frontend.
