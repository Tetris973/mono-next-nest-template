---
description: This guide will walk you through testing the API endpoints using Swagger UI, which is available in development mode.
---

# Test the API

This guide will walk you through testing the API endpoints using Swagger UI, which is available in development mode.

## Accessing Swagger UI

:::info
Ensure your backend server is running in development mode before proceeding.
:::

1. Open your web browser and navigate to `http://localhost:4000/api`

## Authentication Process

### Step 1: Login

1. In the Swagger UI, locate and expand the `POST /auth/login` endpoint.
2. Click the "Try it out" button.
3. In the Request body, input the following credentials:

```json
{
  "username": "tetris",
  "password": "Chocolat123!"
}
```

:::tip
This is an admin account. You can use other accounts as well, which are defined in the `apps/server/src/prisma/seeding/user.seed.ts` file.
:::

4. Click the "Execute" button to send the request.
5. The reponse will normally contain an http-only cookie containing the token. You can't access it but every request after login will automatically include it.

## Testing Authenticated Endpoints

Once authenticated, you can test other API endpoints that require authentication:

1. Scroll through the Swagger UI to find the desired endpoint (e.g., Profile endpoints).
2. Expand the endpoint and click "Try it out".
3. Fill in any required parameters.
4. Click "Execute" to send the request.

## Troubleshooting

:::warning
- Authentication tokens typically have a limited validity period. If you encounter authentication errors, try logging in again to obtain a new token.
- Some endpoints may require specific user roles or permissions. Ensure you're using an account with the necessary access rights when testing these endpoints.
:::

If you experience unexpected errors or behaviors:

1. Verify that your backend server is running correctly.
2. Double-check that you've properly set up your development environment.
3. Ensure you're using the most recent authentication token.