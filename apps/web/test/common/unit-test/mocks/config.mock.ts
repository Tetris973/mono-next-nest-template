import { Env, NodeEnv } from '@web/config/env';
import { LogLevel, LogTarget } from '@web/config/log.enum';

export const mockGetConfig = (): Env => {
  return {
    NODE_ENV: NodeEnv.Test,
    LOG_TARGET: LogTarget.PinoFile,
    LOG_LEVEL: LogLevel.DEBUG,
    BACKEND_URL: 'http://localhost:4000',
  };
};
