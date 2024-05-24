import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Run all the test, including the e2e-spec.ts and repository.ts
// used for wallabysJs
export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts', 'src/**/*.spec.ts'],
    fileParallelism: false,
    root: './',
    setupFiles: ['./test/setup.ts'],
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
