import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Run all the test, including the e2e-spec.ts and repository.ts
// used for wallabysJs
export default defineConfig({
  test: {
    /**
     * Configuration for running tests:
     * - For unit tests only (no database/worker or heavy tests):
     *   Use the first 'include' and 'fileParallelism' settings.
     * - For all tests (including e2e and repository tests):
     *   Uncomment the second 'include' and 'fileParallelism' settings.
     *
     * Adjust these settings to optimize WallabyJs test execution speed.
     */
    include: ['src/**/*.spec.ts'],
    fileParallelism: true,
    // include: ['**/*.e2e-spec.ts', 'src/**/*.spec.ts'],
    // fileParallelism: false,
    root: './',
    setupFiles: ['./test/vitest.setup.ts'],
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
      tsconfigFile: './tsconfig.build.json',
    }),
    // To resolve tsconfig paths
    tsconfigPaths(),
  ],
});
