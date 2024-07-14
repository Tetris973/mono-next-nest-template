import { test, expect, Page } from '@playwright/test';
import { PROFILE_URL, USER_DASHBOARD_URL, LOGIN_URL } from './config/urls';
import { logoutTestUser } from './utils/logout-user.utils';
import { USER_CONTEXT_PATH } from './config/accounts';

test.use({ storageState: USER_CONTEXT_PATH });

/**
 * Navigate to a URL with retries
 * It is used to bypass error from firefox, NS_BINDING_ABORTED when navigating too quickly after some requests.
 *
 * @param page - The page to navigate to the URL
 * @param url - The URL to navigate to
 * @param maxRetries - The maximum number of retries
 */
async function navigateWithRetry(page: Page, url: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto(url, { timeout: 30000, waitUntil: 'networkidle' });
      return;
    } catch (error) {
      console.log(`Navigation attempt ${attempt} failed: ${(error as Error).message}`);
      if (attempt === maxRetries) throw error;
      await page.waitForTimeout(1000); // Wait for 1 second before retrying
    }
  }
}

test.describe('Protected Routes', () => {
  test.describe('Profile page', () => {
    test('should redirect to login page when user is not logged in', async ({ page }) => {
      // Logout user, because logged by default with setup file
      await logoutTestUser(page, 'testUser');

      // Go to profile page
      await navigateWithRetry(page, PROFILE_URL);
      await page.waitForURL(LOGIN_URL);
      await expect(page).toHaveURL(LOGIN_URL);
    });

    test('should redirect to login page when login out', async ({ page }) => {
      // Go to profile page as logged in user
      await page.goto(PROFILE_URL);
      await page.waitForURL(PROFILE_URL);

      // Logout
      await page.getByRole('button', { name: 'testUser' }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
      await expect(page).toHaveURL(LOGIN_URL);
    });
  });

  test.describe('Dashboard page', () => {
    test('should redirect to login page when user is not logged in', async ({ page }) => {
      // Logout user, because logged by default with setup file
      await logoutTestUser(page, 'testUser');

      // Go to dashboard page with increased timeout and error handling
      await navigateWithRetry(page, USER_DASHBOARD_URL);
      await page.waitForURL(LOGIN_URL);
      await expect(page).toHaveURL(LOGIN_URL);
    });

    test('should redirect to login page when logging out', async ({ page }) => {
      // Go to dashboard page as logged in user
      await page.goto(USER_DASHBOARD_URL);
      await page.waitForURL(USER_DASHBOARD_URL);

      // Logout
      await page.getByRole('button', { name: 'testUser' }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
      await expect(page).toHaveURL(LOGIN_URL);
    });
  });
});
