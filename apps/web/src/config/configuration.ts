import { envSchema, Env, BrowserEnv, browserEnvSchema } from './env';
import { z } from 'zod';

export class ConfigError extends Error {
  constructor(
    message: string,
    public error?: z.ZodError,
  ) {
    super(message);
    this.name = 'ConfigError';
  }

  public getIssues(): Array<{ key: string; cause: string }> {
    return (
      this.error?.issues.map((issue) => ({
        key: issue.path.join('.'),
        cause: issue.message,
      })) || []
    );
  }

  public getIssuesString(): string {
    return this.getIssues()
      .map((issue) => `- ${issue.key}: ${issue.cause}`)
      .join('\n');
  }
}

let config: Env | null = null;

export function getConfig(): Env {
  if (config) return config;

  const result = envSchema.safeParse({
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

let browserConfig: BrowserEnv | null = null;

export function getBrowserConfig(): BrowserEnv {
  if (browserConfig) return browserConfig;

  const result = browserEnvSchema.safeParse({
    BROWSER_LOG_LEVEL: process.env.NEXT_PUBLIC_BROWSER_LOG_LEVEL,
  });

  if (!result.success) {
    throw new ConfigError('Browser environment variable validation failed', result.error);
  }

  browserConfig = result.data;
  return browserConfig;
}
