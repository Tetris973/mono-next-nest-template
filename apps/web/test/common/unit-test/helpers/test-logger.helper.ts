import pino, { DestinationStream, LoggerOptions } from 'pino';
export { LogLevel } from '@web/config/log.enum';

interface LogEntry extends Record<string, unknown> {
  context?: string;
}

/**
 * Custom stream for pino that stores the logs in memory
 */
export class TestStream implements DestinationStream {
  messages: LogEntry[] = [];

  write(msg: string) {
    this.messages.push(JSON.parse(msg));
  }
}

export const testStream = new TestStream();

const options: LoggerOptions = {
  messageKey: 'msg',
  level: 'trace', // Set the level t trace to capture all logs for tests
};
export const rootLogger = pino(options, testStream);

/**
 * Function mocking the getLogger function from development/production logger
 * @param context - The context of the logger
 * @returns The logger
 */
export function getLogger(context?: string) {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'This testLogger should only be used in test environment, you may have mistaken this loggger with the app/lib/logger.ts',
    );
  }
  return context ? rootLogger.child({ context }) : rootLogger;
}

export function getLogs(): LogEntry[] {
  return testStream.messages;
}

export function clearLogs(): void {
  testStream.messages = [];
}

export function getLogsByContext(context: string): LogEntry[] {
  return testStream.messages.filter((log) => log.context === context);
}
