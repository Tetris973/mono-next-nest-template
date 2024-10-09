import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Run all the unit test only, excluding the e2e-spec.ts and repository.ts
export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    root: './',
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
