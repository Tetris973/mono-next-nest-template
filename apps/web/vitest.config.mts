import { defineConfig } from 'vitest/config';
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    // To resolve tsconfig paths
    tsconfigPaths(),
  ],
  test: {
    setupFiles: ['./vitest.setup.mts'],
    environment: 'jsdom',
  },
});
