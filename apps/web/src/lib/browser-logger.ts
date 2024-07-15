import pino from 'pino';
import { getBrowserConfig } from '@web/config/configuration';

const levelColors = {
  TRACE: '#848484',
  DEBUG: '#4d8ace',
  INFO: '#0fbc7a',
  WARN: '#e5e50e',
  ERROR: '#b05858',
  FATAL: '#efeded',
};

function formatLogMessage(o: any): [...string[], object] | string[] {
  const timestamp = new Date().toLocaleTimeString();
  const level = pino.levels.labels[o.level].toUpperCase().padEnd(5);
  const context = o.context ? `[${o.context}] ` : '';
  const msg = typeof o.msg === 'string' ? o.msg : JSON.stringify(o.msg);

  const { level: _, time: __, msg: ___, context: ____, ...rest } = o;

  const levelColor = levelColors[level.trim() as keyof typeof levelColors] || '#FFFFFF';

  const formattedMessage = [
    `%c[${timestamp}] %c${level} %c${context}%c${msg}`,
    'font-weight:bold',
    `color:${levelColor};font-weight:bold`,
    'font-weight:bold',
    'color:#11a6cb;font-weight:normal',
  ];

  if (Object.keys(rest).length > 0) {
    return [...formattedMessage, rest];
  }
  return formattedMessage;
}

export function createBrowserLogger() {
  if (typeof window === 'undefined') {
    throw new Error('Browser Logger cannot be used on the server side');
  }

  const browser = {
    asObject: true,
    write: {
      debug: (o: object) => console.log(...formatLogMessage(o)),
      error: (o: object) => console.error(...formatLogMessage(o)),
      fatal: (o: object) => console.error(...formatLogMessage(o)),
      info: (o: object) => console.log(...formatLogMessage(o)),
      trace: (o: object) => console.log(...formatLogMessage(o)),
      warn: (o: object) => console.warn(...formatLogMessage(o)),
    },
  };

  const { BROWSER_LOG_LEVEL } = getBrowserConfig();
  const logger = pino({
    level: BROWSER_LOG_LEVEL,
    browser,
  });

  logger.info({ context: 'logger', LOG_LEVEL: BROWSER_LOG_LEVEL }, 'Browser Logger initialized');
  return logger;
}
