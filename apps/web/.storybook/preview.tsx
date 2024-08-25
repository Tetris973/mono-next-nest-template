import '@mantine/core/styles.css';
import React, { useEffect } from 'react';
import type { Preview } from "@storybook/react";
import { AppRouterInstance, AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ChakraProvider } from '@chakra-ui/react';
import { MantineProvider, useMantineColorScheme, AppShell } from '@mantine/core';
import { addons } from '@storybook/preview-api';
import { theme } from '../src/lib/mantine-theme';
import { useChannel } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';

/*
 * Mock the useRouter from next/navigation
 * Add elements when needed
 */
export const mockRouter: Partial<AppRouterInstance> = {
  push: (arg) => {console.log('push', arg)},
};

const channel = addons.getChannel();

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const handleColorScheme = (value: boolean) => setColorScheme(value ? 'dark' : 'light');

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return <>{children}</>;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  }
};

export const decorators = [
  (renderStory: any) => <ColorSchemeWrapper>{renderStory()}</ColorSchemeWrapper>,
  (renderStory: any) => <MantineProvider theme={theme}><AppShell header={{ height: 60 }}>{renderStory()}</AppShell></MantineProvider>,
  (renderStory: any) => <ChakraProvider>{renderStory()}</ChakraProvider>,
  (renderStory: any) => <AppRouterContext.Provider value={mockRouter as AppRouterInstance}>{renderStory()}</AppRouterContext.Provider>,
];
