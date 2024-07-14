import { z } from 'zod';
import { LogLevel, LogTarget } from '@server/config/log.config';

/**
 * Schema for validating environment variables
 */
export const envSchema = z.object({
  LOG_TARGET: z.nativeEnum(LogTarget).optional().default(LogTarget.PinoPretty),
  LOG_LEVEL: z.nativeEnum(LogLevel).optional().default(LogLevel.INFO),
});

/**
 * Type definition for the validated environment variables
 */
export type Env = z.infer<typeof envSchema>;
