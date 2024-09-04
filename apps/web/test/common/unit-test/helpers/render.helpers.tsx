import { render as testingLibraryRender, RenderResult } from '@testing-library/react';
import { MantineProvider, AppShell } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { theme } from '@web/lib/mantine-theme';
import { SWRConfig } from 'swr';

/**
 * Wrapper helper for the SWRConfig. It is used to provide a clean cache for each differnet render of a hook during testing.
 * @example
 * // For testing hooks
 * const { result } = renderHook(() => useHook(), { wrapper: SwrWrapper });
 *
 */
export const SwrWrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

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
