# Naming Conventions

Consistent naming conventions are crucial for maintaining a readable and understandable codebase. This document outlines the naming conventions for various elements in the project.

## General Rules

1. Use descriptive and meaningful names.
2. Avoid abbreviations unless they are widely understood.
3. Be consistent with the naming style throughout the project.

:::info For all convention of the project
These conventions are guidelines. While they should be followed in most cases, deviations are acceptable if there are compelling reasons.
:::

## File Naming

1. Use kebab-case for file names, unless the file exports a React component: `log-in-user.dto.ts`, `auth-service.ts`
2. React component files should be in PascalCase: `LoginForm.tsx`, `Button.tsx`
3. Test files should have the same name as the file they're testing, with a `.spec` suffix: `auth-service.spec.ts`, `Button.spec.tsx`
4. Use extensions to qualify a file when appropriate: `.use` or `.hook` for React hooks, `.interface` for interfaces, `.type` for type definitions, `.utils` for utility functions, etc. There's no definitive set of extensions; use what's pertinent when you find multiple files exporting the same kind of code.

Example:
```
log-in-user.dto.ts
LoginForm.tsx
check-authentication.utils.ts
auth.controller.ts
dto-validation-error.type.ts
http-status.enum.ts
```

## Naming elements inside the code

See [Naming Convention](/docs/code-quality/naming-conventions) for more details.