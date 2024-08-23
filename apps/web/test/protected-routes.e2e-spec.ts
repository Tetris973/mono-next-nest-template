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
      await page.goto(PROFILE_URL);
      await page.waitForURL(LOGIN_URL);
      await expect(page).toHaveURL(LOGIN_URL);
    });

    test('should redirect to login page when login out', async ({ page }) => {
      // Go to profile page as logged in user
      await page.goto(PROFILE_URL);
      await page.waitForURL(PROFILE_URL);

      // Logout
      await page.getByRole('button', { name: 'User menu' }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
      await expect(page).toHaveURL(LOGIN_URL);
    });
  });

  test.describe('Dashboard page', () => {
    test('should redirect to login page when user is not logged in', async ({ page }) => {
      // Logout user, because logged by default with setup file
      await logoutTestUser(page);

      // Go to dashboard page with increased timeout and error handling
      await page.goto(USER_DASHBOARD_URL);
      await page.waitForURL(LOGIN_URL);
      await expect(page).toHaveURL(LOGIN_URL);
    });

    test('should redirect to login page when logging out', async ({ page }) => {
      // Go to dashboard page as logged in user
      await page.goto(USER_DASHBOARD_URL);
      await page.waitForURL(USER_DASHBOARD_URL);

      // Logout
      await page.getByRole('button', { name: 'User menu' }).click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
      await expect(page).toHaveURL(LOGIN_URL);
    });
  });
});
