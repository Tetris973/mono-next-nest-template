import { LogLevel, LogTarget } from './log.enum';

/**
 * Here we define all the keys and values for the ConfigService Object used in the application
 * @note All variables should be named the same as the ones in the .env file to override them.
 */
export default () => ({
  // Use port 4000 for development as frontend uses 3000
  PORT: parseInt(process.env.PORT || '4000', 10),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  // Run swagger only in development mode
  RUN_SWAGGER: process.env.NODE_ENV === 'development',
  // Log to console prettified by default
  LOG_TARGET: (process.env.LOG_TARGET as LogTarget) || LogTarget.PINO_PRETTY,
  // Log level is set to INFO by default
  LOG_LEVEL: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
});
