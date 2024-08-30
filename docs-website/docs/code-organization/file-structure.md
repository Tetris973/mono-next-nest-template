# File Structure

:::caution
The following guidelines are flexible, not rigid rules, try to apply them, but do not get stuck on them.

1. **Principle-Based Approach**: Follow these principles when possible. Exceptions may occur.

2. **Documentation Priority**: When in doubt, consult this documentation first, not existing code.

3. **Handling Exceptions**:
   - If an exception is necessary, document it thoroughly with comments explaining WHY, not just WHAT.
   - Consider updating this documentation if exceptions become common.

4. **Evolution of Guidelines**: These guidelines may evolve. This document should remain the primary reference and source of truth.

5. **Avoid Propagating Undocumented Conventions**: When in doubt, don't replicate code patterns from codebase that deviate from these guidelines without proper justification and documentation, always try to follow the guidelines.
:::

Proper file structure is crucial for maintaining a clean, organized, and scalable codebase. This document outlines guidelines for structuring files within the project.

## Colocation of Related Files

Follow the principle of colocation, which means keeping related files close together. This approach improves maintainability and makes it easier to understand the relationships between different parts of the code.

### Guidelines:

1. **Test Files**: Place test files in the same directory as the file they're testing. For example, `user.service.ts` and `user.service.spec.ts` should be in the same folder.

2. **Storybook Files**: If using Storybook, keep story files alongside their corresponding component files. For instance, `Button.tsx` and `Button.stories.tsx` should be in the same directory.

3. **Styles**: If a component has its own specific styles, keep the style file next to the component file. For example, `Card.tsx` and `Card.module.css` should be together.

4. **Moving to Generic Folders**: If a file (e.g., a component) starts to be used by multiple unrelated modules or becomes more generic in nature, consider moving it to a more general folder. For example, a component that starts in `user/dashboard` but is later used in `login`, `signup`, and `marketplace` might be better placed in a general `components` folder.

## Common Project Folders guidelines

This section describes general-purpose folders commonly found in software projects.

### `common/` and `utils/`

These two folders serve similar but distinct purposes:

#### `common/`
Contains shared code, utilities, and resources that are specific to the project's domain and used across multiple parts of the application. This folder typically includes:
- Shared constants
- Common types and interfaces
- Utility functions used in multiple modules, but specific to the project's domain

Example of code in `common/`:
```typescript
// common/constants.ts
export const MAX_USERNAME_LENGTH = 50;
export const ALLOWED_FILE_TYPES = ['jpg', 'png', 'pdf'];

// common/types.ts
export interface User {
  id: string;
  username: string;
  email: string;
}

// common/validation.ts
export function isValidEmail(email: string): boolean {
  // Project-specific email validation logic
}
```

#### Subfolders in `common/`

The `common/` folder can contain a variety of subfolders, which may be related to:

1. General folder found in all projects:

    - `constants/`: Shared constants.
    - `helpers/`: Utility functions tied to the project's.
    - ...
2. Language-specific features: These are elements that are tied to the programming language you're using, rather than a specific framework. For example, in a TypeScript project:

   - `decorators/`: Custom decorators that can be used across the project.
   - `enums/`: Enumeration types used throughout the application.
   - `types/`: Custom type definitions shared across the project.
   - `interfaces/`: Shared interface definitions.
   - ...

3. Framework-specific features: These are elements that are more closely tied to the framework you're using. For example, in a NestJS project:

   - `pipes/`: Custom pipes for data transformation and validation.
   - `guards/`: Guards for controlling access to routes or methods.
   - ...

4. Project-specific concepts: As your project evolves, you might introduce new concepts that are specific to your application domain.

    - `validations/`: Custom validations that can be used across the project.
    - ...
:::caution
Always consider collocation first. Start by keeping related files close to where they're used. Only move elements to the `common/` folder when they are truly shared across multiple parts of your application and when centralizing them adds clear value to the project structure.
:::

The `common/` folder structure might look something like this:

```
├── common
│   ├── decorators
│   │   ├── public.decorator.ts
│   │   ├── requests
│   │   │   ├── logged-in-user.decorator.ts
│   │   │   └── ...
│   ├── enums
│   ├── helpers
│   ├── exceptions
│   ├── interfaces
│   ├── types
│   ├── pipes       
│   ├── guards 
│   └── project-specific-concept
```

:::caution
Remember, this structure should evolve based on your project's needs. Don't create folders preemptively; instead, refactor and create new subfolders as patterns emerge in your codebase.
:::

#### `utils/`
Contains utility functions and helper modules that are generic and could potentially be used in any project. These are not specific to the project's domain. For example:
- Date formatting functions
- Generic string manipulation helpers
- Common math operations

Example of code in `utils/`:
```typescript
// utils/dateHelpers.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// utils/stringHelpers.ts
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// utils/mathHelpers.ts
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
```

### `config/`
Holds configuration files for the project. This may include:
- Definition and validation of environment variables
- Default values for configuration parameters

### `test/`
While we follow the principle of colocation for unit tests (placing them next to the files they're testing), this folder is dedicated to:
- End-to-end (e2e) tests
- Integration tests
- Test shared code and helpers used across different test types (unit, integration, e2e)
- Test configurations and setup files

:::info
This file can itself contain config, common, ... folders
:::

### `lib/`
Contains custom configurations of external dependencies. This folder might include:
- Custom logger configurations (e.g., pino-logger.module for backend)
- Third-party library setups (e.g., FontAwesome configuration for frontend)
- Other external dependency customizations specific to the project

### `components/`
Stores reusable UI components. This folder is typically used in frontend projects and may include:
- Basic UI elements (buttons, inputs, etc.)
- More complex UI components built from basic elements
- Layout components (e.g., headers, footers, sidebars)
- Components that wrap other components to provide additional functionality

## Key Directories

This section outlines key elements of the project structure, focusing on directories and files that have specific uses, configurations, or that benefit from a brief description in the project.

### `.husky/`
Used to run logic when doing a commit. It's configured to run lint-staged, which lints and formats the project code before each commit. This prevents code with formatting issues or linting errors from being pushed to the remote repository and eventually consumming resources of the CI. 

:::info No test hook
Tests in pre-commit hooks take too much time, and if they fail, it's hard to track them through Husky. Therefore, they are not included in the hook. (Additionally, users may want to quickly commit just to store a certain stage of development locally.) Running tests remains the responsibility of the developer and the CI pipeline.
:::

### `.vscode/`
Contains VS Code configuration files for the project. This ensures all developers use the same settings, such as:
- Format on save
- Project-specific folder icons
- Debugging configurations

### `apps/`
Contains all the different applications that make up the project. Each app in this directory is a separate part of the mono-repo structure.

### `docker/`
Contains all Docker-related files, including:
- Dockerfiles for building images
- Docker Compose files for running the project locally and in production
- Docker-related scripts

### `docs-website/`
Contains the entire documentation for the project. We keep our documentation as close to the code as possible. 

:::info Exception
Project-related documents that contains sensitive or that need to be shared with the client should not be in the repository, they might be better suited for a tool like Confluence or Bookstack.
:::

### `apps/server/shared/`
Contains generated/build files from the server app that are shared with the client app.

## Key Files

### `eslint-rules.js`
This file contains all the ESLint rules shared by all the apps in the mono-repo. It's not a standard `.eslintrc.js` file because I couldn't configure a parent file that could be extended by others. Instead, it exports all the shared rules to be used by individual app configurations.

### `package.json`
The root `package.json` file is used to:
- Run commands that affect the whole project (e.g., building project images, running all apps in dev mode, ...)
- Install dependencies needed at the project level (e.g., lint-staged, husky, ...)

### `prettier-config.js`
Similar to `eslint-rules.js`, this file exports Prettier rules to be used in the Prettier config of all the apps. It's a workaround for not being able to have a parent `.prettierrc` file that could be extended.

### `tsconfig.json`
This is a standard TypeScript configuration file that contains the general and shared TypeScript settings. Individual apps should extend this configuration and may add or override rules as needed for their specific requirements.