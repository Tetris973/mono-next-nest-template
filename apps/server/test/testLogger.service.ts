import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TestLogger implements LoggerService {
  public logs: string[] = [];
  private includeTimestamp: boolean;

  constructor(includeTimestamp: boolean = true) {
    this.includeTimestamp = includeTimestamp;
  }

  private formatMessage(
    message: string,
    level: string,
    context?: string,
  ): string {
    const timestamp = this.includeTimestamp
      ? `${new Date().toISOString()} `
      : '';
    return `${timestamp}[${level}] ${context || 'Context'}: ${message}`;
  }

  log(message: string, context?: string) {
    const logMessage = this.formatMessage(message, 'Log', context);
    this.logs.push(logMessage);
  }

  error(message: string, trace?: string, context?: string) {
    const errorMessage = `${message} Trace: ${trace}`;
    const logMessage = this.formatMessage(errorMessage, 'Error', context);
    this.logs.push(logMessage);
  }

  warn(message: string, context?: string) {
    const logMessage = this.formatMessage(message, 'Warn', context);
    this.logs.push(logMessage);
  }

  debug(message: string, context?: string) {
    const logMessage = this.formatMessage(message, 'Debug', context);
    this.logs.push(logMessage);
  }

  verbose(message: string, context?: string) {
    const logMessage = this.formatMessage(message, 'Verbose', context);
    this.logs.push(logMessage);
  }

  printLogs(): string {
    return this.logs.join('\n');
  }
}
