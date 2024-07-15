import pino from 'pino';
import { getConfig } from '@web/config/configuration';
import { LogTarget } from '@server/config/log.config';
import { join } from 'path';

export function createServerLogger() {
  if (typeof window !== 'undefined') {
    throw new Error('Server Logger cannot be used on the client side');
  }

  const { NODE_ENV, LOG_LEVEL, LOG_TARGET } = getConfig();
  const isTargetFile = LOG_TARGET === LogTarget.PinoFile;

  let transport;
  if (isTargetFile) {
    transport = {
      target: 'pino/file',
      options: {
        destination: join(process.cwd(), 'logs', `${NODE_ENV}.log`),
        mkdir: true,
      },
    };
  } else {
    transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
      },
    };
  }

  const logger = pino({
    level: LOG_LEVEL,
    transport,
    redact: ['req.headers.authorization'], // Redact sensitive information
  });

  logger.info({ context: 'logger', LOG_LEVEL, LOG_TARGET }, 'Server Logger initialized');
  return logger;
}
