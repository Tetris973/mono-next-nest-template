/** @type {import('next').NextConfig} */
const nextConfig = {
  // wanted to use param to change the name of Next js page, so that we can for instance name it home.page.tsx
  // does not work currently
  // throw error if only one page extension
  // With multiple extension, the pages are not found 404 error
  // pageExtensions: ['page.tsx'],

  // Required otherwise next build with unwanted files, like .stories.tsx, spec, ...
  typescript: {
    tsconfigPath: './tsconfig.build.json',
  },
};

export default nextConfig;
