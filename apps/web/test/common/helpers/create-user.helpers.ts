import { request, APIRequestContext, APIResponse } from '@playwright/test';
import { getConfig } from '@web/config/configuration';
import { FullUserDto } from '@dto/modules/user/dto/full-user.dto';
import { UserDto } from '@dto/modules/user/dto/user.dto';

/**
 * Creates a test user.
 *
 * @param testName - The name of the test case being tested.
 * @returns The created user.
 * @throws Will throw an error if user creation fails.
 */
export async function createTestUser(testName: string): Promise<FullUserDto> {
  const username = `PW-${testName}`;
  const password = 'TestPassword123!';

  if (username.length < 6) {
    throw new Error('Username too short');
  }
  if (username.length > 32) {
    throw new Error('Username too long');
  }

  let apiContext: APIRequestContext | null = null;

  try {
    apiContext = await request.newContext({
      baseURL: getConfig().BACKEND_URL,
    });

    console.log('Creating user', username, password);

    const res: APIResponse = await apiContext.post('/auth/signup', {
      data: {
        username,
        password,
        confirmPassword: password,
      },
    });

    if (!res.ok()) {
      throw new Error(`Failed to create user: ${res.status()} ${res.statusText()}`);
    }

    const userDto: UserDto = await res.json();

    return { ...userDto, password };
  } catch (error) {
    console.error(`Error creating test user: ${(error as Error).message}`);
    throw error;
  } finally {
    if (apiContext) {
      await apiContext.dispose();
    }
  }
}
