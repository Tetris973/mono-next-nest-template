import { test as setup, request } from '@playwright/test';
import { getServerConfig } from '@web/config/configuration';
import { userAccount, adminAccount, USER_CONTEXT_PATH, ADMIN_CONTEXT_PATH } from './config/accounts';

/**
 * This function performs a direct API login and saves the auth state
 */
async function apiLogin(username: string, password: string, authFilePath: string) {
  const context = await request.newContext({ storageState: undefined });

  try {
    const response = await context.post(`${getServerConfig().BACKEND_URL}/auth/login`, {
      form: {
        username,
        password,
      },
    });

    if (response.status() !== 200) {
      throw new Error(`Login failed with status ${response.status()}`);
    }

    await context.storageState({ path: authFilePath });
  } finally {
    await context.dispose();
  }
}

/**
 * This setup project will be run before all the tests, it performs authentication of a shared
 * account for all tests and saves the auth state to a file.
 * If the test needs a specific user for the test, use the custom fixture playwright/fixtures.ts
 *
 * @example
 * test.use({ storageState: 'playwright/.auth/user-account-shared.json' });
 */
setup('authenticate as user', async () => {
  await apiLogin(userAccount.username, userAccount.password, USER_CONTEXT_PATH);
});

/**
 * This setup will authenticate the admin account and save the auth state to a file.
 */
setup('authenticate-admin', async () => {
  await apiLogin(adminAccount.username, adminAccount.password, ADMIN_CONTEXT_PATH);
});
