import { expect, test } from '@playwright/test';
import { USER_DASHBOARD_URL, BASE_URL } from './config/urls';
import { test as customTest } from '@webRoot/playwright/fixtures';
import { createTestUser } from './common/helpers/create-user.helpers';
import { deleteTestUser } from './common/helpers/delete-user.helpers';
import { ADMIN_CONTEXT_PATH } from './config/accounts';

customTest.describe('regular user dashboard', () => {
  customTest('regular user can only view data', async ({ page, account }) => {
    // Navigate to dashboard
    await page.goto(BASE_URL);
    const dashboardButton = await page.getByRole('button', { name: 'Go to dashboard' });
    await expect(dashboardButton).toBeVisible();
    await dashboardButton.click();
    await expect(page).toHaveURL(USER_DASHBOARD_URL);

    // Click on the user in the list
    await page.getByText(`${account.id}${account.username}`).click();

    // Verify user data
    const userCard = page.getByLabel('User card');

    await expect(userCard).toContainText(account.username);
    await expect(userCard).toContainText(`ID: ${account.id}`);
    await expect(userCard).toContainText(`Created At: ${new Date(account.createdAt).toLocaleString()}`);
    await expect(userCard).toContainText(`Updated At: ${new Date(account.updatedAt).toLocaleString()}`);
  });
});

test.describe('admin dashboard', () => {
  // Replace the storage state with the admin user
  test.use({ storageState: ADMIN_CONTEXT_PATH });

  test('admin can edit and delete other users', async ({ page }) => {
    let user;
    let newUsername;
    try {
      // Create a new user to be edited/deleted
      user = await createTestUser('dashB-adm');

      // Navigate to dashboard
      await page.goto(BASE_URL);
      const dashboardButton = await page.getByRole('button', { name: 'Go to dashboard' });
      await expect(dashboardButton).toBeVisible();
      await dashboardButton.click();
      await expect(page).toHaveURL(USER_DASHBOARD_URL);

      // Click on the created user
      await page.getByText(`${user.id}${user.username}`).click();

      // Click edit profile button
      await page.getByLabel('Edit user').click();

      // Edit username
      newUsername = `${user.username}-E`;
      await page.getByLabel('User name').click();
      await page.getByLabel('User name').fill(newUsername);

      // Submit changes
      await page.getByLabel('Submit profile changes').click();

      // Verify changes
      const editMessage = await page.getByText(`Profile of ${newUsername} updated successfully`);
      await expect(editMessage).toBeVisible();
      await expect(page.getByRole('button').filter({ hasText: newUsername })).toBeVisible();

      // Delete user
      const deleteButton = page.getByLabel('Delete user');
      await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
      await deleteButton.click();

      const confirmDeleteButton = page.getByRole('button', { name: 'Delete' });
      await confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
      // In CI, in sequential mode, the test could never manage to click the button, so we wait for it to appear
      // There may be aother better ways to do this, or it would be interesting to find the real issue
      // But for the moment we wait for 1 second
      await page.waitForTimeout(1000);
      await confirmDeleteButton.click();

      // Verify user was deleted
      const deleteMessage = await page.getByText(`User ${newUsername} deleted successfully!`);
      await expect(deleteMessage).toBeVisible();
      await expect(page.getByText(`${user.id}${user.username}`)).not.toBeVisible();

      // Mark the user as successfully deleted in the test
      user = null;
    } catch (error) {
      throw error; // Re-throw the error to mark the test as failed
    } finally {
      // Cleanup the created or updated user so that test can't fail because of error 409 conflict when retrying
      if (user) {
        await deleteTestUser(user);
        if (newUsername) {
          await deleteTestUser({ ...user, username: newUsername });
        }
      }
    }
  });
});
