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
