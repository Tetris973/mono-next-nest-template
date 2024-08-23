import { render as testingLibraryRender, RenderResult } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@web/lib/mantine-theme';

/**
 * Renders the UI with the MantineProvider theme.
 * @param ui - The UI to render.
 * @returns The rendered UI.
 */
export function render(ui: React.ReactNode): RenderResult {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme}>{children}</MantineProvider>
    ),
  });
}
