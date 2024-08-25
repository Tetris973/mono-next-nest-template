import { test, expect } from '@playwright/test';
import { PROFILE_URL, USER_DASHBOARD_URL, LOGIN_URL } from './config/urls';
import { logoutTestUser } from './utils/logout-user.utils';
import { USER_CONTEXT_PATH } from './config/accounts';

test.use({ storageState: USER_CONTEXT_PATH });

test.describe('Protected Routes', () => {
  test.describe('Profile page', () => {
    test('should redirect to login page when user is not logged in', async ({ page }) => {
      // Logout user, because logged by default with setup file
      await logoutTestUser(page);

      // Go to profile page
      await page.goto(PROFILE_URL, {
        waitUntil: 'networkidle',
        timeout: 10000, // 10 seconds timeout for navigation
      });

      // Wait for the URL to change to the login page
      await page.waitForURL(LOGIN_URL, { timeout: 5000 });

      // Assert that we are on the login page
      expect(page.url()).toBe(LOGIN_URL);
    });

    test('should redirect to login page when login out', async ({ page }) => {
      // Go to profile page as logged in user
      await page.goto(PROFILE_URL, {
        waitUntil: 'networkidle',
        timeout: 10000, // 10 seconds timeout for navigation
      });

      // Logout
      await page.getByRole('button', { name: 'User menu' }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();

      // Wait for the URL to change to the login page
      await page.waitForURL(LOGIN_URL, { timeout: 5000 });

      // Assert that we are on the login page
      expect(page.url()).toBe(LOGIN_URL);
    });
  });

  test.describe('Dashboard page', () => {
    test('should redirect to login page when user is not logged in', async ({ page }) => {
      // Logout user, because logged by default with setup file
      await logoutTestUser(page);

      // Navigate to the protected route
      await page.goto(USER_DASHBOARD_URL, {
        waitUntil: 'networkidle',
        timeout: 10000, // 10 seconds timeout for navigation
      });

      // Wait for the URL to change to the login page
      await page.waitForURL(LOGIN_URL, { timeout: 5000 });

      // Assert that we are on the login page
      expect(page.url()).toBe(LOGIN_URL);
    });

    test('should redirect to login page when logging out', async ({ page }) => {
      // Navigate to the protected route
      await page.goto(USER_DASHBOARD_URL, {
        waitUntil: 'networkidle',
        timeout: 10000, // 10 seconds timeout for navigation
      });

      // Logout
      await page.getByRole('button', { name: 'User menu' }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();

      // Wait for the URL to change to the login page
      await page.waitForURL(LOGIN_URL, { timeout: 5000 });

      // Assert that we are on the login page
      expect(page.url()).toBe(LOGIN_URL);
    });
  });
});
