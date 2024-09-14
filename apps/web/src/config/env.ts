import { z } from 'zod';
import { LogLevel, LogTarget } from '@web/config/log.enum';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Schema for validating server side environment variables
 */
export const envSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv).optional().default(NodeEnv.Development),
  LOG_TARGET: z.nativeEnum(LogTarget).optional().default(LogTarget.PinoPretty),
  LOG_LEVEL: z.nativeEnum(LogLevel).optional().default(LogLevel.INFO),
  BACKEND_URL: z.string(),
});

/**
 * Schema for validating browser side environment variables
 * @note
 * Be carreful to not expose sensitive information/server-side environment variable here!
 */
export const browserEnvSchema = z.object({
  BROWSER_LOG_LEVEL: z.nativeEnum(LogLevel).optional().default(LogLevel.INFO),
});

/**
 * Type definition for the validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Type definition for the validated browser environment variables
 */
export type BrowserEnv = z.infer<typeof browserEnvSchema>;
