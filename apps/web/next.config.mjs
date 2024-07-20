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

  // To produce a minimal standalone output, make it easier to deploy the app on non-vercel host
  output: 'standalone',

  webpack: (config) => {
    // Ignored files in tsconfig.build was not working, This rule works to prevent compilation of development files (test, stories, and e2e files)
    config.module.rules.push({
      test: /(\.(spec|stories)\.[jt]sx?$)|(^test\/.*\.[jt]sx?$)/,
      loader: 'ignore-loader',
    });
    return config;
  },
};

export default nextConfig;
