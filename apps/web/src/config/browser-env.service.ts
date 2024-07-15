'use server';

import { getBrowserConfig } from './configuration';
import { BrowserEnv } from './env';

/**
 * Provide access to the environment variables for the browser on the client side
 * @returns The browser environment variables
 * @note
 * Be carreful to not expose sensitive information, server side environment variable here!
 */
export async function getBrowserEnv(): Promise<BrowserEnv> {
  return getBrowserConfig();
}
