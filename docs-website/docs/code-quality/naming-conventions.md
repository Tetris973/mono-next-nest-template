# Naming Convention

Proper naming is crucial for code readability and maintainability. This document outlines the conventions for naming variables, functions, classes, and other code elements.

## Variable Naming

1. Use camelCase for variable names: `userName`, `isLoading`
2. Boolean variables should have a prefix like `is`, `has`, or `should`: `isValid`, `hasPermission`
3. Constants should be in UPPER_SNAKE_CASE: `MAX_RETRY_ATTEMPTS`, `API_BASE_URL`

:::info exception
   This convention typically applies to global or module-level constants that represent fixed values or configuration. However, in modern JavaScript/TypeScript development, especially with strict linter rules, many variables may be automatically transformed as constants (e.g., when a variable is not reassigned). In these cases, it's not necessary (and often not desirable) to use UPPER_SNAKE_CASE. For example:
:::

```typescript
   // Global or module-level constant
   const MAX_RETRY_ATTEMPTS = 3;

   // Function-scoped "constant" that doesn't need UPPER_SNAKE_CASE
   const calculateTotal = (items: Item[]) => {
     const subtotal = items.reduce((sum, item) => sum + item.price, 0);
     return subtotal * 1.1; // with 10% tax
   };
   ```

   Use UPPER_SNAKE_CASE for constants that are truly meant to be unchanging, configuration-like values, rather than for all variables declared with `const`.
## Function Naming

1. Use camelCase for function names: `getUserProfile()`, `calculateTotalPrice()`
2. Use verbs to describe what the function does: `fetchData()`, `validateInput()`
3. For React components, use PascalCase: `UserProfile`, `Button`

## Interface and Type Naming

1. Use PascalCase for interface and type names: `UserData`, `ApiResponse`
2. Do not prefix interfaces or type with `I` or `T` (e.g., `IUserData`, `TApiResponse`). It can be causes problems while refactoring and lead to inconsistency.

## Class Naming

1. Use PascalCase for class names: `UserService`, `DataValidator`
2. Do not prefix abstract classes with `Abstract`: `AbstractRepository`. It can be causes problems while refactoring and lead to inconsistency.

## Enum Naming

1. Use PascalCase for enum names: `UserRole`, `PaymentStatus`
2. Use singular form for the enum name. For example, use `Color` instead of `Colors`.
3. Enum values should be in UPPER_SNAKE_CASE: `UserRole.ADMIN`, `PaymentStatus.PAYMENT_PENDING`

## Component Prop Naming

1. Use camelCase for prop names: `userName`, `onSubmit`
2. Boolean props should be named as adjectives: `isDisabled`, `hasError`

Remember, the goal of these conventions is to make our code more readable and maintainable. Consistency is key, so always follow these conventions unless there's a compelling reason not to.