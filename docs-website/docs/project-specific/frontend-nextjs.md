# Frontend (Next.js) Project Structure

This document outlines the key elements of the Next.js frontend structure, focusing explaining directories and files for quick access to some architecture choices and features.

## Key Directories

### `.storybook/`
Contains configuration for Storybook, which is used as a component viewer. Note that we've kept Storybook integration minimal to avoid maintenance overhead and conflicts with the testing setup.

- `preview.tsx`: Configures Storybook, including setup for component libraries and global mocks.

#### `config/`
Contains configuration files for environment variables and their validation.

#### `lib/`
Contains utility logic, including Pino logger configuration and FontAwesome setup.

## Development Philosophy

Frontend structure emphasizes:

1. **Separation of Concerns**: Logic (.use files) is separated from UI components for better maintainability and testability.

2. **Dependency Injection**: Both hooks and components use a dependency injection pattern, allowing for easy mocking in tests and storybook scenarios.

3. **Colocation**: Related files (components, hooks, stories) are kept together to improve discoverability and maintenance.