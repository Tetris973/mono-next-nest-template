import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, LoggerModuleAsyncParams, Params as PinoParams } from 'nestjs-pino';
import { join } from 'path';
import { LogLevel, LogTarget } from '@server/config/log.enum';

/**
 * Pino logger module for NestJS
 * Auto log all http requests and responses, use json format to log {param1: ..., param2: ...}
 *
 * @see https://github.com/iamolegga/nestjs-pino
 */
const loggerConfig: LoggerModuleAsyncParams = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<PinoParams> => {
    const nodeEnv = configService.getOrThrow<string>('NODE_ENV');
    const logLevel = configService.getOrThrow<LogLevel>('LOG_LEVEL');
    const logTarget = configService.getOrThrow<LogTarget>('LOG_TARGET');

    const fileTransport = {
      target: 'pino/file',
      options: {
        destination: join(process.cwd(), 'logs', `${nodeEnv}.log`),
        mkdir: true,
      },
    };

    const consoleTransport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
      },
    };

    const defaultConsoleTransport = {
      target: 'pino/file',
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
        customProps: (req) => ({
          context: 'HTTP',
          body: (req as any).body,
        }),
        transport,
        level: logLevel,
        redact: ['req.headers.authorization'],
      },
    };
  },
};

export const PinoLoggerModule = LoggerModule.forRootAsync(loggerConfig);
