# API Response Structure

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

## Principle: Direct Data Response

API endpoints should return the requested data directly in the response body, without wrapping it in additional structures.

### Do:
Return the data directly:

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### Don't:
Wrap the data in unnecessary structures:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "message": "User retrieved successfully"
}
```

## Rationale

1. **Simplicity**: Direct responses are easier to consume and process.
2. **Consistency**: All endpoints follow the same pattern, improving API predictability.
3. **Proper use of HTTP**: Leverage HTTP status codes and headers for metadata.

## Example

```typescript
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.findOne({ id: Number(id) });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return plainToClass(UserDto, user);
  }
```
:::info
In this example, in a nestjs project, exceptions are automatically mapped to Http responses.
:::