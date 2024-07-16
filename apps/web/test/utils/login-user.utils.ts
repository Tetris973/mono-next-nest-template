import { Page, expect } from '@playwright/test';
import { LOGIN_URL, BASE_URL } from '@testWeb/config/urls';

/**
 * Login a test user through the UI and go to the home page
 * @param page - The Playwright page object
 * @param username - The username of the user to login
 * @param password - The password of the user to login
 */
export const loginTestUser = async (page: Page, username: string, password: string) => {
  console.log();
  await page.goto(LOGIN_URL);
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(BASE_URL);
  // expect message Welcome to the dashboard
  const welcomeMessage = await page.getByText('Welcome to My Next.js App');
  await expect(welcomeMessage).toBeVisible();
  const usernameMessage = await page.getByText(username);
  await expect(usernameMessage).toBeVisible();
};
