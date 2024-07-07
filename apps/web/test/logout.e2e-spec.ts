import { test, expect } from '@playwright/test';
import { BASE_URL } from './config/urls';
import { userAccount, USER_CONTEXT_PATH } from './config/accounts';

test.describe('Logout Flow', () => {
  test.use({ storageState: USER_CONTEXT_PATH });

  test('logout as user successfully', async ({ page }) => {
    // Verify user is logged in
    await page.goto(BASE_URL);
    const usernameMessage = await page.getByText(userAccount.username);
    await expect(usernameMessage).toBeVisible();

    // Logout
    await page.getByRole('button', { name: userAccount.username }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Check if logout was successful
    await expect(page).toHaveURL(BASE_URL);
    await expect(usernameMessage).not.toBeVisible();
  });
});
