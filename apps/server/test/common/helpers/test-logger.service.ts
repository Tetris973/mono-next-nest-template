import { Injectable } from '@nestjs/common';
import { levels } from 'pino';
import { LogLevel } from '@server/config/log.enum';
export { LogLevel };

/**
 * Interface representing a some log entry.
 * Those logs entries are common, but there can be a lot more depending on how the logs were configured when called.
 */
interface LogEntry extends Record<string, unknown> {
  level: number;
  msg?: string;
  context?: string;
}

@Injectable()
export class TestLoggerService {
  private messages: LogEntry[] = [];

  write(msg: string) {
    this.messages.push(JSON.parse(msg));
  }

  /**
   * Returns all the log messages captured by the TestLoggerService.
   * As this service is instanciated for each test file, the logs don't collide between tests.
   * If you want to have logs for only one test case, then you should call clearLogs() at the beginning of the test case or beforeEach().
   * @returns An array of LogEntry objects.
   */
  getLogs(): LogEntry[] {
    return this.messages;
  }

  clearLogs(): void {
    this.messages = [];
  }

  getLogsByContext(context: string): LogEntry[] {
    return this.messages.filter((log) => log.context === context);
  }

  mapNumericToEnumLogLevel(log: LogEntry): LogLevel {
    // Current implementation uses the static levels definition from Pino
    // If other levels value are  defined in the application, then the impletation would need to access the  pino object used in the app and gets the levels from there.
    return levels.labels[log.level] as LogLevel;
  }
}
