import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, LoggerModuleAsyncParams, Params as PinoParams } from 'nestjs-pino';
import { join } from 'path';
import { LogLevel } from './config/log.config';

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
    const nodeEnv = configService.get<string>('NODE_ENV');
    const logLevel = configService.get<LogLevel>('logLevel');
    const isTargetFile = configService.get<string>('logTarget') === 'pino/file';

    let transportOptions;
    if (isTargetFile) {
      transportOptions = {
        target: 'pino/file',
        options: {
          destination: join(process.cwd(), 'logs', `${nodeEnv}.log`),
          mkdir: true,
        },
      };
    } else {
      transportOptions = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
        },
      };
    }

    return {
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: transportOptions,
        level: logLevel,
        redact: ['req.headers.authorization'], // Redact sensitive information
      },
    };
  },
};

export const PinoLoggerModule = LoggerModule.forRootAsync(loggerConfig);
