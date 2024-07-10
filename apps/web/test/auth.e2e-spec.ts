import { test, expect } from '@playwright/test';
import { LOGIN_URL, BASE_URL, SIGNUP_URL } from './config/urls';
import { deleteTestUser } from './utils/delete-user.utils';
import { UserDto } from '@dto/user/dto/user.dto';

test.describe('Authentication Flow', () => {
  const username = 'PW-auth';
  const password = 'TestPassword123!';

  test('should sign up a new user and then login with the same user', async ({ page }) => {
    // Starts from home page
    await page.goto(BASE_URL);

    // Navigate to the signup page by clicking on the signup button in header
    await page.click('text=Signup');
    await page.waitForURL(SIGNUP_URL);

    // Fill in the signup form
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);

    // Submit the form
    await page.click('button[type="submit"]');

    // Assert that we are redirected to the login page
    await expect(page).toHaveURL(LOGIN_URL);

    // Check for success message
    const successMessage = await page.getByText('Signup successful');
    await expect(successMessage).toBeVisible();

    // Fill in the login form
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);

    // Submit the form
    await page.click('button[type="submit"]');

    // Assert that we are redirected to the home page
    await expect(page).toHaveURL(BASE_URL);

    // Check for elements that indicate successful login
    const welcomeMessage = await page.getByText('Welcome to My Next.js App');
    await expect(welcomeMessage).toBeVisible();
    const usernameMessage = await page.getByText(username);
    await expect(usernameMessage).toBeVisible();

    // Cleanup,
    await deleteTestUser({ username, password } as UserDto);
  });
});