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
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/prerequisites-setup',
        'getting-started/getting-started',
        'getting-started/development-setup',
        'getting-started/setup-docker-dev',
        'getting-started/api-testing',
        'getting-started/backend-api-sdk-update',
        'getting-started/testing',
        'getting-started/production-setup',
        'getting-started/continuous-integration',
        'getting-started/image-building',
        'getting-started/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Development Guide',
      items: [
        {
          type: 'category',
          label: 'Code Organization',
          items: [
            'development-guide/code-organization/file-structure',
            'development-guide/code-organization/naming-conventions',
            'development-guide/code-organization/file-responsability',
          ],
        },
        {
          type: 'category',
          label: 'Core Concepts',
          items: [
            'development-guide/core-concepts/controller-service-repository-layers',
            'development-guide/core-concepts/api-response-structure',
            'development-guide/core-concepts/data-transfer-objects-dto',
          ],
        },
        {
          type: 'category',
          label: 'Development Principles and Practices',
          items: [
            'development-guide/development-principles-and-practices/simplicity-first',
            'development-guide/development-principles-and-practices/iterative-development',
            'development-guide/development-principles-and-practices/avoiding-premature-optimization',
            'development-guide/development-principles-and-practices/avoiding-premature-abstraction',
            'development-guide/development-principles-and-practices/comments-and-documentation',
          ],
        },
        {
          type: 'category',
          label: 'Code Quality',
          items: [
            'development-guide/code-quality/linter-and-formatter',
            'development-guide/code-quality/naming-conventions',
            'development-guide/code-quality/magic-numbers-and-strings',
            'development-guide/code-quality/reducing-nested-blocks',
            'development-guide/code-quality/early-returns',
          ],
        },
        {
          type: 'category',
          label: 'Testing Strategy',
          items: [
            'development-guide/testing-strategy/purpose-of-tests',
            'development-guide/testing-strategy/test-coverage',
            'development-guide/testing-strategy/test-file-structure',
            'development-guide/testing-strategy/unit-test-best-practices',
            {
              type: 'category',
              label: 'How to Test',
              items: [
                'development-guide/testing-strategy/how-to-test/repository-testing',
                'development-guide/testing-strategy/how-to-test/controller-testing',
                'development-guide/testing-strategy/how-to-test/e2e-backend-testing',
                'development-guide/testing-strategy/how-to-test/react-component-testing',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Collaboration',
          items: [
            'development-guide/collaboration/git-best-practices',
            'development-guide/collaboration/code-review-process',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'App and Package Architectures',
      items: [
        'app-and-package-architectures/backend-nestjs',
        'app-and-package-architectures/frontend-nextjs',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting and Support',
      items: [
        'troubleshooting-and-support/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
