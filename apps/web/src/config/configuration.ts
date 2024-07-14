import { envSchema, Env } from './env';
import { z } from 'zod';

class ConfigError extends Error {
  constructor(
    message: string,
    public issues?: z.ZodIssue[],
  ) {
    super(message);
    this.name = 'ConfigError';
  }
}

let config: Env | null = null;

export function getConfig(): Env {
  if (config) return config;

  const result = envSchema.safeParse({
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_TARGET: process.env.LOG_TARGET,
  });

  if (!result.success) {
    throw new ConfigError('Environment variable validation failed', result.error.issues);
  }

  config = result.data;
  return config;
}
