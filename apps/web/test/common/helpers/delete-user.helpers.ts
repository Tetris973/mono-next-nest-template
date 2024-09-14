import { request, APIRequestContext } from '@playwright/test';
import { getConfig } from '@web/config/configuration';
import { UserDto } from '@web/lib/backend-api/index';

/**
 * Deletes a test user created by Playwright.
 *
 * @param user - The user to be deleted.
 * @throws Will throw an error if the user was not created by Playwright.
 */
export async function deleteTestUser(user: UserDto): Promise<void> {
  const adminUser = 'tetris';
  const adminPassword = 'Chocolat123!';

  let adminContext: APIRequestContext | null = null;

  try {
    // Login as admin to delete the user
    adminContext = await request.newContext({
      baseURL: getConfig().BACKEND_URL,
    });

    const loginResponse = await adminContext.post('/auth/login', {
      data: {
        username: adminUser,
        password: adminPassword,
      },
    });

    if (!loginResponse.ok()) {
      throw new Error(`Failed to log in as admin: ${loginResponse.status()} ${loginResponse.statusText()}`);
    }

    // Delete the user
    // Throw error if user is not created by playwright
    if (!user.username.startsWith('PW')) {
      throw new Error('User not created by playwright');
    }

    // If id is not given, search id from username
    let id = user.id;
    if (!id) {
      const response = await adminContext.get('/users/');
      const users = await response.json();
      id = users.find((u: UserDto) => u.username === user.username)?.id;
    }

    const deleteResponse = await adminContext.delete(`/users/${id}`);
    if (!deleteResponse.ok()) {
      throw new Error(`Failed to delete user: ${deleteResponse.status()} ${deleteResponse.statusText()}`);
    }
  } catch (error) {
    console.error(`Error deleting test user: ${(error as Error).message}`);
    throw error;
  } finally {
    if (adminContext) {
      await adminContext.dispose();
    }
  }
}
