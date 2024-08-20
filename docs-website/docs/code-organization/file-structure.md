# File Structure

Proper file structure is crucial for maintaining a clean, organized, and scalable codebase. This document outlines guidelines for structuring files within the project.

## Colocation of Related Files

Follow the principle of colocation, which means keeping related files close together. This approach improves maintainability and makes it easier to understand the relationships between different parts of the code.

### Guidelines:

1. **Test Files**: Place test files in the same directory as the file they're testing. For example, `user.service.ts` and `user.service.spec.ts` should be in the same folder.

2. **Storybook Files**: If using Storybook, keep story files alongside their corresponding component files. For instance, `Button.tsx` and `Button.stories.tsx` should be in the same directory.

3. **Styles**: If a component has its own specific styles, keep the style file next to the component file. For example, `Card.tsx` and `Card.module.css` should be together.

4. **Moving to Generic Folders**: If a file (e.g., a component) starts to be used by multiple unrelated modules or becomes more generic in nature, consider moving it to a more general folder. For example, a component that starts in `user/dashboard` but is later used in `login`, `logout`, and `marketplace` might be better placed in a general `components` folder.

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