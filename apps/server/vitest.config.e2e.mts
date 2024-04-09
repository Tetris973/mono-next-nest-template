import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts', 'src/**/*.repository.spec.ts'],
    // Check if need to enable, prevent concurrent access of database when end-to-end testing
    fileParallelism: false,
    root: './',
    alias: {
      '@test': './apps/server/test',
    },
    setupFiles: ['./test/setup.ts'],
  },
  plugins: [
    [
      // This is required to build the test files with SWC
      swc.vite({
        // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
        module: { type: 'es6' },
        tsconfigFile: './tsconfig.build.json',
      }),
      // To resolve tsconfig paths
      tsconfigPaths(),
    ],
  ],
  resolve: {
    alias: {
      '@test': './apps/server/test',
    },
  },
});