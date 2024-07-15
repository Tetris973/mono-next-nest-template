/** @type {import('next').NextConfig} */
const nextConfig = {
  // wanted to use param to change the name of Next js page, so that we can for instance name it home.page.tsx
  // does not work currently
  // throw error if only one page extension
  // With multiple extension, the pages are not found 404 error
  // pageExtensions: ['page.tsx'],

  // Developement only feature to highlight potential issues in the code
  reactStrictMode: true,

  // Required otherwise next build with unwanted files, like .stories.tsx, spec, ...
  typescript: {
    tsconfigPath: './tsconfig.build.json',
  },

  experimental: {
    // Enable the use of root intrumentation hook, loaded at the start of the application
    // Used for loading environment variables and configuration
    instrumentationHook: true,

    // Needed for the logger to work in the server components
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
};

export default nextConfig;
