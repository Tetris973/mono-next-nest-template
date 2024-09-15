# Unit Testing Best Practices

When writing unit tests , follow these guidelines to ensure your tests are effective, maintainable, and provide value:

1. **Mock Dependencies**: When a unit test depends on other elements such as services or repositories, those dependencies should be mocked.

   ```typescript
   import { describe, it, expect, beforeEach, vi } from 'vitest';
   import { UserService } from './UserService';
   import { UserRepository } from './UserRepository';

   describe('UserService', () => {
     let service: UserService;
     let mockedUserRepository: UserRepository;

     beforeEach(() => {
       mockedUserRepository = {
         findOne: vi.fn(),
         save: vi.fn(),
       } as any;

       service = new UserService(mockedUserRepository);
     });

     it('should find a user', async () => {
       vi.mocked(mockedUserRepository.findOne).mockResolvedValue({ id: 1, name: 'John' });

       const result = await service.findUser(1);

       expect(mockedUserRepository.findOne).toHaveBeenCalledWith(1);
       expect(result).toEqual({ id: 1, name: 'John' });
     });
   });
   ```

2. **Simple Mocks are Valuable**: Even if a test only checks that a method was called with the correct parameters (using `toHaveBeenCalledWith`), it still provides value:
   - It serves as regression testing, catching unexpected changes in method calls.
   - It provides a base for more complex tests as the codebase evolves.

3. **Evolve Tests with Code**: As your source code becomes more complex, revisit and enhance your unit tests. The initial simple mocks provide a foundation for more sophisticated test scenarios.

4. **Test Isolation**: Each unit test should be independent and not rely on the state created by other tests. Reset mocks and test data between each test case.

   ```typescript
   beforeEach(() => {
     vi.resetAllMocks();
   });
   ```

By following these practices, your unit tests will not only verify the current behavior of your code but also serve as a safety net for future changes and a foundation for more comprehensive testing as your project grows in complexity.