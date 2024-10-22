import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, LoggerModuleAsyncParams, Params as PinoParams } from 'nestjs-pino';
import { join } from 'path';
import { LogTarget } from '@server/config/log.enum';
import { AllConfig } from '@server/config/config.module';

/**
 * Pino logger module for NestJS
 * Auto log all http requests and responses, use json format to log {param1: ..., param2: ...}
 *
 * @see https://github.com/iamolegga/nestjs-pino
 */
const loggerConfig: LoggerModuleAsyncParams = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService<AllConfig>): Promise<PinoParams> => {
    const nodeEnv = configService.getOrThrow('main.NODE_ENV', { infer: true });
    const logLevel = configService.getOrThrow('main.LOG_LEVEL', { infer: true });
    const logTarget = configService.getOrThrow('main.LOG_TARGET', { infer: true });

    const fileTransport = {
      target: 'pino/file',
      level: logLevel,
      options: {
        destination: join(process.cwd(), 'logs', `${nodeEnv}.log`),
        mkdir: true,
      },
    };

    const consoleTransport = {
      target: 'pino-pretty',
      level: logLevel,
      options: {
        colorize: true,
        singleLine: true,
      },
    };

    const defaultConsoleTransport = {
      target: 'pino/file',
      level: logLevel,
      options: {
        destination: 1, // stdout
      },
    };

    let transport;
    switch (logTarget) {
      case LogTarget.PINO_PRETTY:
        transport = consoleTransport;
        break;
      case LogTarget.PINO_FILE:
        transport = fileTransport;
        break;
      case LogTarget.PINO_PRETTY_AND_FILE:
        transport = {
          targets: [fileTransport, consoleTransport],
        };
        break;
      case LogTarget.PINO_DEFAULT_AND_FILE:
        transport = {
          targets: [fileTransport, defaultConsoleTransport],
        };
        break;
      default:
        transport = defaultConsoleTransport; // Default to standard console logging if not specified
    }

    return {
      pinoHttp: {
        /**
         * Warning, for the log level to correctly be applied, it should be set in the root pinoHttp config and for each target!
         * If only applied in just one place, it defaults to info level.
         * @see https://stackoverflow.com/questions/78091936/why-pino-logger-debug-doesnt-work-in-nestjs
         */
        level: logLevel,
        customProps: (req) => ({
          context: 'HTTP',
          body: (req as any).body,
        }),
        transport,
        redact: ['req.headers.authorization'],
      },
    };
  },
};

export const PinoLoggerModule = LoggerModule.forRootAsync(loggerConfig);
