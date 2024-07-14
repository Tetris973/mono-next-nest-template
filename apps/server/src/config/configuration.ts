import { LogLevel, LogTarget } from './log.config';

/**
 * Here we define all the keys and values for the ConfigService Object used in the application
 */
export default () => ({
  // Use port 4000 for development as frontend uses 3000
  port: parseInt(process.env.PORT || '4000', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  // Run swagger only in development mode
  runSwagger: process.env.NODE_ENV === 'development',
  // Log to console prettified by default
  logTarget: (process.env.LOG_TARGET as LogTarget) || LogTarget.PinoPretty,
  // Log level is set to INFO by default
  logLevel: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
});
