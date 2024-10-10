import {
  serverEnvSchema,
  ServerEnv,
  BrowserStaticEnv,
  browserStaticEnvSchema,
  browserDynamicEnvSchema,
  BrowserDynamicEnv,
} from './env';
import { ConfigError } from './config.error';

let config: ServerEnv | null = null;

/**
 * Retrieves the server-side configuration.
 * @throws {Error} If called from the browser environment.
 * @throws {ConfigError} If environment variable validation fails.
 * @returns The validated server-side configuration.
 * @remarks
 * - This function is intended to be called only from the server-side.
 */
export function getServerConfig(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('Server configuration cannot and should not be used on the browser side !!!');
  }
  if (config) return config;

  const result = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_TARGET: process.env.LOG_TARGET,
    BACKEND_URL: process.env.BACKEND_URL,
  });

  if (!result.success) {
    throw new ConfigError('Environment variable validation failed', result.error);
  }

  config = result.data;
  return config;
}

let browserDynamicConfig: BrowserDynamicEnv | null = null;

/**
 * Retrieves the browser dynamic configuration.
 * @throws {Error} If called from the browser environment.
 * @throws {ConfigError} If environment variable validation fails.
 * @returns The validated browser dynamic configuration.
 * @remarks
 * - This function is intended to be called by server actions only ofr the browser or direclty form the server side.
 * - It should not be invoked directly from the browser.
 */
export function getBrowserDynamicConfig(): BrowserDynamicEnv {
  if (typeof window !== 'undefined') {
    throw new Error('Browser dynamic configuration cannot be accessed from the client side');
  }

  if (browserDynamicConfig) return browserDynamicConfig;

  const result = browserDynamicEnvSchema.safeParse({});

  if (!result.success) {
    throw new ConfigError('Browser dynamic environment variable validation failed', result.error);
  }

  browserDynamicConfig = result.data;
  return browserDynamicConfig;
}

let browserStaticConfig: BrowserStaticEnv | null = null;

/**
 * Retrieves the browser static configuration.
 * @throws {ConfigError} If environment variable validation fails.
 * @returns The validated browser static configuration.
 * @remarks
 * - This function should only be used to retrieve environment variables prefixed with NEXT_PUBLIC_.
 * - According to NextJs documentation, these values are replaced at build time, so runtime changes to the .env file will not affect them.
 */
export function getBrowserStaticConfig(): BrowserStaticEnv {
  if (browserStaticConfig) return browserStaticConfig;

  const result = browserStaticEnvSchema.safeParse({
    BROWSER_LOG_LEVEL: process.env.NEXT_PUBLIC_BROWSER_LOG_LEVEL,
  });

  if (!result.success) {
    throw new ConfigError('Browser static environment variable validation failed', result.error);
  }

  browserStaticConfig = result.data;
  return browserStaticConfig;
}
