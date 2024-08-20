import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
 const sidebars: SidebarsConfig = {
  docsSidebar: [
    'README',
    'prerequisites-setup',
    'getting-started',
    'development-setup',
    'setup-docker-dev',
    'api-testing',
    'testing',
    'production-setup',
    'continuous-integration',
    'image-building',
    'deployment',
    {
      type: 'category',
      label: 'Code Organization',
      items: [
        'code-organization/file-structure',
        'code-organization/naming-conventions',
        'code-organization/file-responsability',
      ],
    },
    {
      type: 'category',
      label: 'Development Principles and Practices',
      items: [
        'development-principles-and-practices/simplicity-first',
        'development-principles-and-practices/iterative-development',
        'development-principles-and-practices/avoiding-premature-optimization',
        'development-principles-and-practices/avoiding-premature-abstraction',
        'development-principles-and-practices/comments-and-documentation',
      ],
    },
    {
      type: 'category',
      label: 'Code Quality',
      items: [
        'code-quality/linter-and-formatter',
        'code-quality/naming-conventions',
        'code-quality/magic-numbers-and-strings',
        'code-quality/reducing-nested-blocks',
        'code-quality/early-returns',
      ],
    },
    {
      type: 'category',
      label: 'Testing Strategy',
      items: [
        'testing-strategy/purpose-of-tests',
        'testing-strategy/test-coverage',
        'testing-strategy/test-file-structure',
        'testing-strategy/unit-test-best-practices',
        {
          type: 'category',
          label: 'How to Test',
          items: [
            'testing-strategy/how-to-test/repository-testing',
            'testing-strategy/how-to-test/controller-testing',
            'testing-strategy/how-to-test/e2e-backend-testing',
            'testing-strategy/how-to-test/react-component-testing',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Collaboration',
      items: [
        'collaboration/git-best-practices',
        'collaboration/code-review-process',
      ],
    },
    {
      type: 'category',
      label: 'Project Specific',
      items: ['project-specific/backend-nestjs', 'project-specific/frontend-nextjs'],
    },
  ],
};

export default sidebars;
