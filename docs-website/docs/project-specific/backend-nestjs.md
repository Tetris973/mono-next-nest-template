# Backend (NestJS) Project Structure

This document outlines the key elements and responsibilities of the NestJS backend structure, focusing on the architectural decisions and guidelines that shape the project.

## Key Concepts and Responsibilities

#### `auth/`
Contains all authentication-related files:
- `passport/`: Configures Passport.js strategies (JWT and Local) for authentication.
- `public.decorator.ts`: A decorator to bypass authentication for specific routes (e.g., login).
- `user.decorator.ts`: A decorator to easily access the authenticated user's data in controller methods.

#### `authz/`
Houses authorization-related files:
- `casl-ability.factory/`: Implements CASL for fine-grained authorization.
- `permissions.decorator.ts`: A decorator to check user permissions in controller endpoints.
- `permissions.guard.ts`: A guard to enforce permissions defined by the decorator.

### Configuration (`config/`)

The configuration module is responsible for:
- Defining and providing access to environment variables for the entire application.
- Validating environment variables to ensure all required configurations are present and correctly formatted.
- Parsing environment variables and providing typed configuration objects to other parts of the application.