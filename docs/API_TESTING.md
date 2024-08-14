# API Testing Guide

This guide will walk you through testing the API endpoints using Swagger UI, which is available in development mode.

## Accessing Swagger UI

1. Ensure your backend server is running in development mode.
2. Open your web browser and navigate to `http://localhost:4000/api`.

## Authentication

To test protected endpoints, you'll need to authenticate first. Follow these steps:

1. In the Swagger UI, locate and expand the `POST /auth/login` endpoint.
2. Click the "Try it out" button.
3. In the Request body, input the following credentials:
   ```json
   {
     "username": "tetris",
     "password": "Chocolat123!"
   }
   ```
   Note: This is an admin account. You can use other accounts as well, which are defined in the `apps/server/src/prisma/seeding/user.seed.ts` file.

4. Click the "Execute" button to send the request.

### Obtaining the Authentication Token

After successful login, you need to extract the authentication token. Because the result from the backend is an HTTP-only cookie with the token inside, you can't access the token from Swagger or any browser JavaScript. Therefore, we need to get it from the logs:

1. Check the logs of your backend server.
2. Look for a line that starts with: `"set-cookie":"Authentication=`
3. Copy the value after `Authentication=` up to (but not including) the semicolon.

The copied value should look similar to this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...[rest of the token]...
```

### Applying the Authentication Token

To use the token for authenticated requests:

1. In the Swagger UI, click the "Authorize" button at the top of the page.
2. In the "Value" field for cookie authentication, paste your copied token.
3. Click "Authorize" to apply the token.

## Testing Authenticated Endpoints

Once authenticated, you can test other API endpoints that require authentication:

1. Scroll through the Swagger UI to find the endpoint you want to test (e.g., Profile endpoints).
2. Expand the endpoint and click "Try it out".
3. Fill in any required parameters.
4. Click "Execute" to send the request.

## Notes

- The authentication token is typically valid for a limited time. If you receive authentication errors, you may need to login again and obtain a new token.
- Some endpoints may require specific user roles or permissions. Ensure you're using an account with the necessary access rights when testing these endpoints.
- If you encounter any unexpected errors or behaviors, double-check that your backend server is running correctly and that you've properly set up your development environment.