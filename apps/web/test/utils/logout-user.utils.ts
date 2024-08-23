import { BASE_URL } from '@testWeb/config/urls';
import { Page } from '@playwright/test';

/**
 * Logout the test user through the UI
 * @param page - The playwright page object
 * @param username - The username of the test user
 */
export const logoutTestUser = async (page: Page) => {
  await page.goto(BASE_URL);
  await page.getByRole('button', { name: 'User menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.waitForURL(BASE_URL);
};
