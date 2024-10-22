import pino from 'pino';
import { getServerConfig } from '@web/config/configuration';
import { LogTarget } from '@web/config/log.enum';
import { join } from 'path';

export function createServerLogger() {
  if (typeof window !== 'undefined') {
    throw new Error('Server Logger cannot be used on the client side');
  }

  const { NODE_ENV, LOG_LEVEL, LOG_TARGET } = getServerConfig();

  const fileTransport = {
    target: 'pino/file',
    level: LOG_LEVEL,
    options: {
      destination: join(process.cwd(), 'logs', `${NODE_ENV}.log`),
      mkdir: true,
    },
  };

  const consoleTransport = {
    target: 'pino-pretty',
    level: LOG_LEVEL,
    options: {
      colorize: true,
      singleLine: true,
    },
  };

  const defaultConsoleTransport = {
    target: 'pino/file',
    level: LOG_LEVEL,
    options: {
      destination: 1, // stdout
    },
  };

  let transport;
  switch (LOG_TARGET) {
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
      transport = defaultConsoleTransport;
  }

  const logger = pino({
    /**
     * Warning, for the log level to correctly be applied, it should be set in the root pinoHttp config and for each target!
     * If only applied in just one place, it defaults to info level.
     * @see https://stackoverflow.com/questions/78091936/why-pino-logger-debug-doesnt-work-in-nestjs
     */
    level: LOG_LEVEL,
    transport,
    redact: ['req.headers.authorization'], // Redact sensitive information
  });

  logger.info({ context: 'logger', LOG_LEVEL, LOG_TARGET }, 'Server Logger initialized');
  return logger;
}
