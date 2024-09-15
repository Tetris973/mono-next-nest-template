# Linter & Formatter (ESLint & Prettier)

The project uses ESLint for maintaining code quality and consistency, and Prettier for code formatting. Both configurations are highly opinionated and designed to minimize the need for developers to think about code syntax and formatting.

## Goals

1. Gain time during development
2. Ensure consistent code across all development sources
3. Reduce cognitive load on developers
4. Eliminate discussions and decisions about code formatting
5. Allow developers to focus on code logic rather than style

## ESLint Configuration

The ESLint configuration can be found in the `.eslintrc.js` file at the root of each project. For shared rules across all projects, see the `eslint-rules.js` file at the root of the monorepo.

:::info App specific rules
Each project may have specific rules in their own `.eslintrc.js` file. The explanation for why these rules are used should be written as comments inside the config file.
:::

## Prettier Configuration

The Prettier configuration can be found in the `.prettierrc.js` file at the root of each project. For shared configuration across all projects, see the `prettier-config.js` file at the root of the monorepo.

## Motivation

The flexibility offered by JavaScript/TypeScript syntax can lead to inconsistencies when developing code across a team. A strict linting and formatting rules aim to create a more uniform coding experience, similar to how you wouldn't want the location of turn signals to vary drastically between different car models - imagine having to search for the turn signal on the steering wheel in one car, on the door in another, and on the seat in a third. Such inconsistency would make driving different cars unnecessarily complicated and potentially dangerous.

However, I recognize that this flexibility can be beneficial in exceptional cases. The rules are designed to be strict by default but allow for exceptions when necessary. (For example, through the use of directives like // @ts-ignore, // eslint-disable-next-line, or configuration files such as .eslintignore)

For details about each ESLint and Prettier configuration parameter and the motivation behind it, please refer to the comments in the `eslint-rules.js` and `prettier-config.js` files at the root of the monorepo.