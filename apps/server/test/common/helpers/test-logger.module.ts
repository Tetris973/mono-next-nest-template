import { TestLoggerService } from './test-logger.service';
import { LoggerModule } from 'nestjs-pino';
import { LogLevel } from '@server/config/log.enum';
export { LogLevel };
import { Module } from '@nestjs/common';

/**
 * The service that collects the logs is created outside the module and not using nestjs pattern.
 * This current implmentation works and does not cause problem fro testing but it is not ideal.
 * Did not manage to make a correct implemntation but for the moment it is enough.
 */
const testLoggerService = new TestLoggerService();

/**
 * A pre-configured NestJS Logger module for testing purposes.
 * This module uses the TestStream to capture logs in memory,
 * allowing for easy assertion and inspection in tests.
 */
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        stream: { write: (msg) => testLoggerService.write(msg) },
        level: 'trace',
        customProps: () => ({
          context: 'HTTP',
        }),
      },
    }),
  ],
  /**
   * It is important to useValue here of the object created outide the module, otherwise nestjs created its own instance
   * that is not shared with the one used in the stream above.
   * This results in no logs being captured by the testLoggerService.
   */
  providers: [{ provide: TestLoggerService, useValue: testLoggerService }],
  exports: [TestLoggerService],
})
export class TestLoggerModule {}
