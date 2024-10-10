'use server';

import { getBrowserDynamicConfig as getConfig } from './configuration';
import { BrowserDynamicEnv } from './env';

/**
 * Provide access to the environment variables loaded on the server for the browser on the client side
 * @returns The browser dynamic environment variables
 * @note
 * Be carreful to not expose sensitive information, server side environment variable here!
 */
export async function getBrowserDynamicConfig(): Promise<BrowserDynamicEnv> {
  return getConfig();
}
