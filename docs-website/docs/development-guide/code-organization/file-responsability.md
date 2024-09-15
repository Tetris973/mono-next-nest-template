# Single Responsibility Principle in File Organization

## Principle of Separation

Instead of having files that contain multiple common types, interfaces, or exceptions used throughout the app, generally prefer to create separate files for each of these elements. This approach offers several benefits:

1. **Quick Search and Understanding**: It enables faster file search and easier comprehension of each file's responsibility.
2. **Focused Content**: It prevents files from becoming too large or holding too much responsibility.
3. **Easier Maintenance**: When a type, interface, or exception needs to be updated or extended, it's easier to locate and modify in its own file.

## Implementation Guidelines

### 1. Single Responsibility Files

Create separate files for individual types, interfaces, exceptions, pipes, filters, etc. For example:

```
user.interface.ts
api-response.type.ts
field-already-in-use.exception.ts
date-format.pipe.ts
```

### 2. Naming Convention

Use descriptive names that clearly indicate the content of the file. Follow the naming conventions outlined in the [file naming conventions](./naming-conventions.md#file-naming).

### 3. Related Responsability

If multiple types, interfaces, exceptions, ... are deeply related to each other and often used together, it's acceptable and sometimes preferable to keep them in the same file. The key is to ensure that these elements have a strong, logical connection.

Example of related types in a single file (`action-response.type.ts`):

```typescript
type IsObject<T> = T extends object ? (T extends any[] ? false : true) : false;

export type ActionErrorResponse<D = undefined> = {
  message: string;
  status: HttpStatus;
  details?: D extends undefined ? never : IsObject<D> extends true ? DtoValidationError<D> : string;
};

export type ActionResponse<T, D = undefined> =
  | { result: T; error?: never }
  | { result?: never; error: ActionErrorResponse<D> };
```

### 4. Avoid Overly Generic Files

The goal is to avoid creating files that become catch-alls for a broad domain. Files like `user.type.ts` or `utility.type.ts` that contain every type related to users or utilities provide little specific information about their contents and can become difficult to maintain.

### 5. Complex Responsability

If a file starts to become complex, having it in its own file makes it easier to understand and focus on. This isolation also makes it easier to add related helper functions or constants specific to that file.

Example of a complex file in its own file (`action-response.type.ts`) see above.

### 6. Using Index Files

When you have many small files in a directory, you can create an index file to consolidate exports. This makes importing multiple related types, interfaces, exceptions, ... more convenient:

```typescript
// types/index.ts
export * from './user.type';
export * from './api-response.type';
export * from './product-inventory.type';

// Usage in another file
import { User, ApiResponse, ProductInventory } from './types';
```

## Conclusion

While these guidelines promote separation of types, interfaces, exceptions, ... into individual files, remember that the ultimate goal is to create a codebase that is easy to navigate, understand, and maintain. Use your judgment to determine when it makes sense to group related elements together, always prioritizing clarity and logical organization.