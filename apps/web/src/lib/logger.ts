import { createServerLogger } from './server-logger';
import { createBrowserLogger } from './browser-logger';
import type { Logger } from 'pino';

let logger: Logger;

/**
 * Create the correct logger singleton base on the runtime, nodejs or browser
 * @returns The logger
 */
function createLogger(): Logger {
  if (typeof window === 'undefined') {
    return createServerLogger();
  }
  return createBrowserLogger();
}

/**
 * Get the logger singleton with an optional context
 * @param context - Additional context to add to the logger, every logs from the child logger will have this context
 * @returns The logger singleton
 * @note
 * In development mode, the logger logs twice in the browser. It is normal and caused by nextjs way of doing things in development mode.
 * @example
 * You may see logs like this:
 *  [8:02:03 PM] INFO  [Home] Home page loaded browser-logger.ts:48:55
 *  [8:02:03 PM] INFO  [Home] Home page loaded localhost:3000:1:952
 *
 */
export function getLogger(context?: string): Logger {
  if (!logger) {
    logger = createLogger();
  }

  if (context) {
    return logger.child({ context });
  }

  return logger;
}
