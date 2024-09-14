import { createTestUser, FullUserDto } from '@webRoot/test/common/helpers/create-user.helpers';
import { deleteTestUser } from '@webRoot/test/common/helpers/delete-user.helpers';
import { getConfig } from '@web/config/configuration';
import { test as baseTest, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';

/**
 * Extended test fixture with custom account and storage state handling
 * @property account - FullUserDto object representing the test user
 * @property workerStorageState - String path to the worker's storage state file
 */
export const test = baseTest.extend<{ account: FullUserDto }, { workerStorageState: string }>({
  /**
   * Uses the same storage state for all tests in this worker
   * @param workerStorageState - Path to the worker's storage state file
   * @param use - Function to use the storage state
   */
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  /**
   * Authenticates once per worker and manages the storage state
   * @param use - Function to use the storage state
   */
  workerStorageState: [
    async ({}, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const authFileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);
      const accountFileName = path.resolve(test.info().project.outputDir, `.auth/${id}.account.json`);

      let account: FullUserDto;
      if (fs.existsSync(authFileName) && fs.existsSync(accountFileName)) {
        // Reuse existing authentication state if any.
        account = JSON.parse(fs.readFileSync(accountFileName, 'utf-8'));
        await use(authFileName);
        return;
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const context = await request.newContext({ storageState: undefined });

      // Gets the name of the test file without the .e2e-spec.ts
      // And create a new account for each worker test
      const testName = test.info().titlePath[0].split('.')[0];
      account = await createTestUser(testName + id);

      // Login the account direclty from the backend
      await context.post(`${getConfig().BACKEND_URL}/auth/login`, {
        form: {
          username: account.username,
          password: account.password,
        },
      });

      await context.storageState({ path: authFileName });
      // Save the account to the file system
      fs.writeFileSync(accountFileName, JSON.stringify(account));
      await context.dispose();
      await use(authFileName);
    },
    { scope: 'worker' },
  ],
  /**
   * Provides the test account information to each test
   * @param use - Function to use the account information
   */
  account: [
    async ({}, use) => {
      const id = test.info().parallelIndex;
      const accountFileName = path.resolve(test.info().project.outputDir, `.auth/${id}.account.json`);
      const account = JSON.parse(fs.readFileSync(accountFileName, 'utf-8'));
      await use(account);
    },
    { scope: 'test' },
  ],
});

/**
 * Clean up the authentication state and account for each worker after all tests are done
 */
test.afterEach(async () => {
  const id = test.info().parallelIndex;
  const authDir = path.join(test.info().project.outputDir, '.auth');
  const authFileName = path.join(authDir, `${id}.json`);
  const accountFileName = path.join(authDir, `${id}.account.json`);

  console.log(`Cleaning up auth files for worker ${id}...`);

  try {
    if (fs.existsSync(accountFileName)) {
      const userData: FullUserDto = JSON.parse(fs.readFileSync(accountFileName, 'utf-8'));
      if (userData.id) {
        await deleteTestUser(userData);
        console.log(`Deleted test user with ID: ${userData.id}`);
      }
      fs.unlinkSync(accountFileName);
    }

    if (fs.existsSync(authFileName)) {
      fs.unlinkSync(authFileName);
    }

    console.log(`Auth files for worker ${id} cleaned up.`);
  } catch (error) {
    console.error(`Error during cleanup for worker ${id}:`, error);
  }
});
