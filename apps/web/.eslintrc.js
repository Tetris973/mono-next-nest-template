const sharedRules = require('../../eslint-rules.js');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  // Prettier must be the last, to avoit conflicts with other plugins
  extends: ['plugin:@typescript-eslint/recommended', 'next/core-web-vitals', 'plugin:storybook/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: ['.eslintrc.js', 'prisma/generated/types.ts', 'next-env.d.ts', 'vitest.*', 'postcss.config.cjs'],
  rules: {
    ...sharedRules,
    // To remove a warning from eslint, this rule target the old version of next.js with pages routing
    '@next/next/no-html-link-for-pages': 'off',
    // Added so that lint command also fix prettier errors
    'prettier/prettier': 'error',
  },
};

