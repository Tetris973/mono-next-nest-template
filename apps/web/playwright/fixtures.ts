import { createTestUser } from '../test/utils/create-user.utils';
import { deleteTestUser } from '../test/utils/delete-user.utils';
import { UserDto } from '@dto/user/dto/user.dto';
import { BACKEND_URL } from '@web/app/constants/api';
import { test as baseTest, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';
export const test = baseTest.extend<{ account: UserDto }, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({}, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex;
      const authFileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);
      const accountFileName = path.resolve(test.info().project.outputDir, `.auth/${id}.account.json`);

      let account: UserDto;
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
      await context.post(`${BACKEND_URL}/auth/login`, {
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
  account: [
    // Load the account from the file system and provide to the test
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
test.afterAll(async () => {
  const id = test.info().parallelIndex;
  const authDir = path.join(test.info().project.outputDir, '.auth');
  const authFileName = path.join(authDir, `${id}.json`);
  const accountFileName = path.join(authDir, `${id}.account.json`);

  console.log(`Cleaning up auth files for worker ${id}...`);

  try {
    if (fs.existsSync(accountFileName)) {
      const userData: UserDto = JSON.parse(fs.readFileSync(accountFileName, 'utf-8'));
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
