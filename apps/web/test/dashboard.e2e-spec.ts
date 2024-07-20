import { expect, test } from '@playwright/test';
import { USER_DASHBOARD_URL, BASE_URL } from './config/urls';
import { test as customTest } from '@webRoot/playwright/fixtures';
import { createTestUser } from './utils/create-user.utils';
import { deleteTestUser } from './utils/delete-user.utils';
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
    await page.getByText(account.username).click();

    // Verify user data
    const userCard = page.getByLabel('User card');
    console.log(account.createdAt, account.createdAt.toLocaleString());

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
    // Create a new user to be edited/deleted
    const user = await createTestUser('dashboard-admin');

    // Navigate to dashboard
    await page.goto(BASE_URL);
    const dashboardButton = await page.getByRole('button', { name: 'Go to dashboard' });
    await expect(dashboardButton).toBeVisible();
    await dashboardButton.click();
    await expect(page).toHaveURL(USER_DASHBOARD_URL);

    // Click on the created user
    await page.getByText(user.username).click();

    // Click edit profile button
    await page.getByLabel('Edit user').click();

    // Edit username
    const newUsername = `${user.username}-E`;
    await page.getByPlaceholder('User name').click();
    await page.getByPlaceholder('User name').fill(newUsername);

    // Submit changes
    await page.getByLabel('Submit profile changes').click();

    // Verify changes
    const editMessage = await page.getByText(`Profile of ${newUsername} updated successfully`);
    await expect(editMessage).toBeVisible();
    await expect(page.locator('li').filter({ hasText: newUsername })).toBeVisible();

    // Delete user
    await page.getByLabel('Delete user').click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Verify user was deleted
    const deleteMessage = await page.getByText(`User ${newUsername} deleted successfully!`);
    await expect(deleteMessage).toBeVisible();
    await expect(page.locator('li').filter({ hasText: user.username })).not.toBeVisible();

    // Cleanup, normally user is already deleted
    await deleteTestUser(user);
  });
});
