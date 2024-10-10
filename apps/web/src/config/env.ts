import { z } from 'zod';
import { LogLevel, LogTarget } from '@web/config/log.enum';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Zod schema for validating server-side environment variables.
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv).optional().default(NodeEnv.Development),
  LOG_TARGET: z.nativeEnum(LogTarget).optional().default(LogTarget.PINO_PRETTY),
  LOG_LEVEL: z.nativeEnum(LogLevel).optional().default(LogLevel.INFO),
  BACKEND_URL: z.string(),
});

/**
 * Zod schema for validating static browser-side environment variables.
 * @remarks
 * These variables are defined at build time and should not contain sensitive information.
 */
export const browserStaticEnvSchema = z.object({
  BROWSER_LOG_LEVEL: z.nativeEnum(LogLevel).optional().default(LogLevel.INFO),
});

/**
 * Zod schema for validating dynamic browser-side environment variables.
 * @remarks
 * These variables are defined at runtime and should not contain sensitive information.
 */
export const browserDynamicEnvSchema = z.object({});

/**
 * Type definition for the validated server environment variables.
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Type definition for the validated static browser environment variables.
 */
export type BrowserStaticEnv = z.infer<typeof browserStaticEnvSchema>;

/**
 * Type definition for the validated dynamic browser environment variables.
 */
export type BrowserDynamicEnv = z.infer<typeof browserDynamicEnvSchema>;
