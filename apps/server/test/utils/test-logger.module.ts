import { DestinationStream } from 'pino';
import { LoggerModule } from 'nestjs-pino';

interface LogEntry extends Record<string, unknown> {
  context?: string;
}

/**
 * A custom stream implementation for capturing log messages in memory.
 * This class is used to store log entries during testing.
 */
export class TestStream implements DestinationStream {
  messages: LogEntry[] = [];

  /**
   * Writes a log message to the in-memory store.
   * @param msg - The log message as a JSON string.
   */
  write(msg: string) {
    this.messages.push(JSON.parse(msg));
  }
}

export const testStream = new TestStream();

/**
 * Retrieves all captured log entries.
 * @returns An array of LogEntry objects representing all captured logs.
 * @note
 * - Logs logged in the array are separate between each test files, so the logs don't collides.
 * - If you want to have logs for only a specific test case, use clearTestLogs() in beforeEach()
 */
export function getTestLogs(): LogEntry[] {
  return testStream.messages;
}

/**
 * Clears all captured log entries.
 * This is useful for resetting the log state between tests.
 */
export function clearTestLogs(): void {
  testStream.messages = [];
}

export function getTestLogsByContext(context: string): LogEntry[] {
  return testStream.messages.filter((log) => log.context === context);
}

/**
 * A pre-configured NestJS Logger module for testing purposes.
 * This module uses the TestStream to capture logs in memory,
 * allowing for easy assertion and inspection in tests.
 */
export const TestLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    stream: testStream,
    level: 'trace',
    customProps: () => ({
      context: 'HTTP',
    }),
  },
});
