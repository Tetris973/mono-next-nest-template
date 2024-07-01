import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import type { Preview } from "@storybook/react";
import { AppRouterInstance, AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/*
 * Mock the useRouter from next/navigation
 * Add elements when needed
 */
export const mockRouter: Partial<AppRouterInstance> = {
  push: (arg) => {console.log('push', arg)},
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    // To have ChakraProvider theming and style in all stories
    (Story) => (
      <AppRouterContext.Provider value={mockRouter as AppRouterInstance}>
        <ChakraProvider>
          <Story />
        </ChakraProvider>
      </AppRouterContext.Provider>
    ),
  ],
};

export default preview;
