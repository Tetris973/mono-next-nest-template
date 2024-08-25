import { render as testingLibraryRender, RenderResult } from '@testing-library/react';
import { MantineProvider, AppShell } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { theme } from '@web/lib/mantine-theme';

/**
 * Renders the UI with the MantineProvider theme.
 * @param ui - The UI to render.
 * @returns The rendered UI.
 */
export function render(ui: React.ReactNode): RenderResult {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>
          <AppShell header={{ height: 60 }}>{children}</AppShell>
        </ModalsProvider>
      </MantineProvider>
    ),
  });
}
