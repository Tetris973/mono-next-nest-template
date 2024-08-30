# Backend Architecture: Controller, Service, and Repository Layers

Backend follows a three-layer architecture: Controller, Service, and Repository.

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

## Controller Layer

Controllers handle incoming HTTP requests and return responses to the client.

### Responsibilities:
- Validate incoming HTTP data
- Define HTTP response status codes
- Format returned data to the correct DTO
- Check user permissions for accessing endpoints
- Perform HTTP-related logic
- ...

### Example:
```typescript
@Controller('auth')
export class AuthController {
  // ... other methods

  @HttpCode(HttpStatus.OK) // HTTP returned success status code
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto, // Incoming DTO, validated with a global configuration in this project
    @CurrentUser() user: User,
  ): Promise<UserDto> {
    // Get and check user's permission to update the user
    const ability = await this.abilityFactory.createForUser(user);
    const canUpdate = ability.can(Action.UPDATE, subject('User', { id: Number(id) }));

    // Return correct HTTP error code
    if (!canUpdate) throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);

    // Call service layer to perform the update
    const update = await this.userService.update({
      where: { id: Number(id) },
      data: updateUserDto,
    });

    // Format and return the DTO to the client
    return plainToClass(UserDto, update);
  }
}
```

## Service Layer

The service layer contains the core business logic of the application.

### Responsibilities:
- Implement business logic
- Process data coming from or going to the repository
- Coordinate complex operations involving multiple repositories or external services
- ...

### Example:
```typescript
@Injectable()
export class AuthService {
  async signup(createUserDto: CreateUserDto) {
    const { password, username } = createUserDto;
    // Call to others services
    const user = await this.userService.findOne({ username });

    // Return business logic error and not http status code error
    if (user) {
      throw new FieldAlreadyInUseException('Username', username);
    }

    // Perform the business logic
    const hash = await bcrypt.hash(password, 10);
    return this.userService.create({ username, password: hash });
  }
}
```

## Repository Layer

The repository layer is responsible for data persistence and retrieval.

### Responsibilities:
- Perform logic for database access (read, write, check operations)
- Map database-related exceptions to exceptions used in the backend business logic
- Abstract the underlying data storage mechanism

### Example:
```typescript
@Injectable()
export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      // Perform the database operation
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      // Map database-related exceptions to exceptions used in the backend business logic
      switch (error.code) {
        case 'P2002': {
          const field = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : '';
          throw new FieldAlreadyInUseException(field, data[field as keyof typeof data]);
        }
        default:
          throw error;
      }
    }
  }
}
```