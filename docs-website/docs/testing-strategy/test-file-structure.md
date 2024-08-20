# Test File Structure

When writing test files, follow these guidelines:

1. **Root Describe**: Use a root `describe` block with the name of the file being tested.

```typescript
describe('AuthService', () => {
  let service: AuthService;
  // ... useful vars and constants

  beforeEach(async () => {
    // ... mocking and initialization
  });

  // ... test cases
});
```

2. **General Tests**: Inside the root `describe`, add `it`/`test` blocks for general elements, like verifying that the module is defined after compilation.

```typescript
it('should be defined', () => {
  expect(service).toBeDefined();
});
```

3. **Method-Specific Tests**: Add child `describe` blocks for each method being tested.

```typescript
describe('signup', () => {
  // ... test cases for signup method
});
```

4. **Test Cases**: Inside each method's `describe` block, add as many `it`/`test` blocks as needed to test various aspects of the method.

5. **Test Case Structure**: Use comments to separate different sections of a test case:
   - `// INIT`: For variable definitions, setup, mocking, etc.
   - `// RUN`: For the actual method call being tested.
   - `// CHECK RESULT`: For expectations and assertions.
   - `// RUN & CHECK RESULTS`: Used when verifying exceptions or for async methods.

:::info exception
Inside a test case, when the content is short, the presence of comments to separate the different sections of the file can be omitted at the begining, but it is still recommended to add them.
:::

:::tip
When testing multiple cases in one test (e.g., create user, login, logout in an E2E test), use multiple `// RUN` and `// CHECK RESULTS` sections.
:::

```typescript
it('should create a new user', async () => {
  // INIT
  const createUserDto = {
    username: 'tetris',
    password: 'pass',
  } as CreateUserDto;

  // RUN
  await service.signup(createUserDto);

  // CHECK RESULTS
  expect(mockedUserService.findOne).toHaveBeenCalledWith({
    username: createUserDto.username,
  });
  expect(mockedUserService.create).toHaveBeenCalledWith({
    username: createUserDto.username,
    password: expect.not.stringMatching(createUserDto.password),
  });
});
```

6. **Readability**: Keep test code meaningful and easily readable. Use descriptive variable names and avoid magic numbers.

By following this structure, your tests will be well-organized, easy to read, and maintainable. They will serve as excellent documentation for your code's behavior and expected outcomes.

<details>
<summary>Click to see full test file example</summary>

```typescript
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@server/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '@server/user/dto/create-user.dto';
import { AuthzService } from '@server/authz/authz.service';
import bcrypt from 'bcrypt';
import { BaseRoles } from '@server/authz/baseRoles.enum';

describe('AuthService', () => {
  let service: AuthService;

  const mockedJwtService = {
    signAsync: vi.fn().mockResolvedValue('token'),
  };

  const mockedUserService = {
    create: vi.fn(),
    findOne: vi.fn(),
    userCredentials: vi.fn(),
  };

  const mockedAuthzService = {
    findAllRolesOfUser: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return mockedUserService;
        }
        if (token === JwtService) {
          return mockedJwtService;
        }
        if (token === AuthzService) {
          return mockedAuthzService;
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token signed from user id', async () => {
      // INIT
      const user = { id: 1 } as User;
      mockedAuthzService.findAllRolesOfUser.mockResolvedValue([
        { id: BaseRoles.ADMIN, name: BaseRoles[BaseRoles.ADMIN] },
        { id: BaseRoles.USER, name: BaseRoles[BaseRoles.USER] },
      ]);
      const expectedRoles = [BaseRoles[BaseRoles.ADMIN], BaseRoles[BaseRoles.USER]];

      // RUN
      const token = await service.login(user);

      // CHECK RESULTS
      expect(mockedJwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        roles: expectedRoles,
      });
      expect(token.accessToken).toBe('token');
    });
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      // INIT
      const createUserDto = {
        username: 'tetris',
        password: 'pass',
      } as CreateUserDto;

      // RUN
      await service.signup(createUserDto);

      // CHECK RESULTS
      expect(mockedUserService.findOne).toHaveBeenCalledWith({
        username: createUserDto.username,
      });
      expect(mockedUserService.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        password: expect.not.stringMatching(createUserDto.password),
      });
    });

    it('should throw an error if the username is already taken', async () => {
      // INIT
      const createUserDto = {
        username: 'tetris',
        password: 'pass',
      } as CreateUserDto;

      mockedUserService.findOne.mockResolvedValue({
        username: 'userAlreadyInUse',
      });

      // RUN  & CHECK RESULTS
      await expect(service.signup(createUserDto)).rejects.toThrow(
        `Username ${createUserDto.username} is already in use.`,
      );
    });
  });

  describe('validateCredentials', async () => {
    const password = 'pass';
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = 'tetris';

    it('should return a user if the credentials are valid', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue({
        username,
        password: hashedPassword,
      });
      mockedUserService.findOne.mockResolvedValue({
        id: 1,
        username,
      });

      // RUN
      const result = await service.validateCredentials(username, password);

      // CHECK RESULTS
      expect(result).toEqual({ id: 1, username });
    });

    it('should throw an error if the password is incorrect', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue({
        username,
        password: hashedPassword,
      });

      // RUN
      await expect(service.validateCredentials(username, 'wrongpass')).rejects.toThrow('Invalid credentials provided');
    });

    it('should throw an error if the user does not exist', async () => {
      // INIT
      mockedUserService.userCredentials.mockResolvedValue(null);
      const username = 'nonexistent';

      // RUN
      await expect(service.validateCredentials(username, 'pass')).rejects.toThrow(
        `User with username ${username} not found`,
      );
    });
  });
});

```

</details>

This comprehensive example demonstrates how to structure a test file for an `AuthService`, including setup, mocking, and various test cases for different methods.