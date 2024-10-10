import { ServerEnv, NodeEnv } from '@web/config/env';
import { LogLevel, LogTarget } from '@web/config/log.enum';

export const mockGetConfig = (): ServerEnv => {
  return {
    NODE_ENV: NodeEnv.Test,
    LOG_TARGET: LogTarget.PINO_FILE,
    LOG_LEVEL: LogLevel.DEBUG,
    BACKEND_URL: 'http://localhost:4000',
  };
};
