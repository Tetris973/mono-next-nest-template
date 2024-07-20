import { test, expect } from '@webRoot/playwright/fixtures';
import { PROFILE_URL, BASE_URL } from './config/urls';

test.describe('Profile Page Flow', () => {
  test('should navigate to profile and be able to edit username', async ({ page, account }) => {
    // Navigate to profile page
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: account.username }).click();
    await page.getByRole('menuitem', { name: 'Profile' }).click();
    await expect(page).toHaveURL(PROFILE_URL);

    // Edit username and submit
    const editedUsername = `${account.username}-E`;
    console.log(`Editing username to: ${editedUsername}`);
    await page.fill('input[name="username"]', editedUsername);
    await page.getByLabel('Submit profile changes').click();

    // Check that username was edited
    const updatedUsername = await page.getByText(editedUsername);
    await expect(updatedUsername).toBeVisible();
  });
});
