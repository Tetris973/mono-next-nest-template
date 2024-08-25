import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './test',
  testMatch: /.*\.e2e-spec\.ts/,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry 2 times on CI only */
  retries: process.env.CI ? 2 : 0,
  /**
   * Number of workers to run tests in parallel in CI
   * Usually, for stability we run playwright test in CI with only 1 worker.
   * But test should be developped to be parralel friendly. This helps have better architectured tests.
   * So for the moment we run playwright test in CI in fully parallel mode.
   */
  workers: process.env.CI ? undefined : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // Not used for the moment as we use config/urls.ts
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // Capture screenshot after each test, used for debugging
    screenshot: 'on',

    // Record video for each test, used for debugging
    video: 'on-first-retry',
  },

  outputDir: 'test-results',

  /* Configure projects for major browsers */
  projects: [
    // This setup project will be run before all the tests, it performs authentication of shared accounts.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup'],
    },

    // Can't use for the moment because of http and secure cookie
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    //   dependencies: ['setup'],
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      // This command will start the Nestjs server
      command: 'npm run start:prod',
      url: 'http://127.0.0.1:4000',
      reuseExistingServer: !process.env.CI,
      cwd: '../server',
      stdout: 'pipe',
    },
    {
      // this command will start the Nextjs server
      command: 'npm run start',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
    },
  ],
});
