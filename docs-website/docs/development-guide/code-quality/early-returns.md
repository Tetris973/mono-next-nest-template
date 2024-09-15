# Early Returns

We recommend using early returns (also known as guard clauses) to improve code readability and reduce nesting.

## Guidelines

1. Check for error conditions or edge cases at the beginning of a function and return early if these conditions are met.
2. Throw exceptions for error cases before proceeding with the main logic.
3. Handle non-happy paths first, leaving the main (happy) path for last, typically with minimal nesting.

Example:
```typescript
function processUser(user: User) {
    if (!user) {
        throw new Error('User is required');
    }

    if (!user.isActive) {
        return { status: 'inactive' };
    }

    // Main logic here, with minimal nesting
    // ...
}
```

This approach helps to:
- Reduce cognitive load by handling special cases first
- Minimize nested if-else structures
- Make the main path of the code more apparent