# Magic Numbers and Strings

Magic numbers and strings are numeric or string literals that appear in code without obvious meaning. They should be avoided to improve code readability and maintainability.

## Guidelines

1. Use constants for any numeric or string value that has meaning in your code.
2. Give these constants descriptive names that explain their purpose.
3. Group related constants in enum-like objects when appropriate.
4. Consider using configuration files for values that might change between environments or deployments.

## Examples

### Magic Numbers

```typescript
// Bad
if (user.age > 18) {
    // ...
}

// Good
const LEGAL_ADULT_AGE = 18;
if (user.age > LEGAL_ADULT_AGE) {
    // ...
}
```

### Magic Strings

```typescript
// Bad
if (user.role === 'admin') {
    // ...
}

// Good
const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

if (user.role === USER_ROLES.ADMIN) {
    // ...
}
```

### Grouping Related Constants

```typescript
// Good
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

if (response.status === HTTP_STATUS.NOT_FOUND) {
    // ...
}
```

## Benefits

1. **Improved Readability**: Constants with descriptive names make the code's intent clearer.
2. **Easier Maintenance**: Changing a value in one place affects all usages.
3. **Reduced Errors**: Misspellings and incorrect values are caught at compile-time.
4. **Better IDE Support**: IDEs can provide autocomplete for defined constants.

## When to Use Inline Values

There are cases where using inline numbers or strings is acceptable:

1. Well-known mathematical constants (e.g., 0, 1, 100 for percentages).
2. Incrementing/decrementing by 1 in loops.
3. Truly arbitrary values with no special meaning.

However, if you're unsure, it's generally safer to create a named constant.

Remember, the goal is to make your code as self-documenting as possible. By avoiding magic numbers and strings, you make your code more readable, maintainable, and less prone to errors.