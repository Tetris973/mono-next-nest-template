import { LogLevel, LogTarget } from './log.enum';

/**
 * Defines the environment variables for the main app.
 * These variables can have the same names as those in process.env,
 * but they can't be used as root variables because process.env variables
 * are not redefined by NestJS config.
 * Here, for instance, they are stored under the `main` key.
 */
export interface MainConfig {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  RUN_SWAGGER: boolean;
  LOG_TARGET: LogTarget;
  LOG_LEVEL: LogLevel;
}

/**
 * Root config object containing all the app's config objects.
 */
export interface AllConfig {
  main: MainConfig;
}

/**
 * Defines all the keys and values for the ConfigService object used in the application.
 * This function returns the configuration object with default values and overrides from environment variables.
 * @returns {AllConfig} The complete configuration object for the application.
 * @note Do not use the same names as .env/process.env variables for root-level properties of the object,
 * as NestJS config does not redefine process.env variables. Instead, nest them under a sub-object.
 */
export default (): AllConfig => {
  const config: AllConfig = {
    main: {
      NODE_ENV: process.env.NODE_ENV!,
      // Use port 4000 for development as frontend uses 3000
      PORT: parseInt(process.env.PORT || '4000', 10),
      JWT_SECRET: process.env.JWT_SECRET!,
      JWT_EXPIRATION: process.env.JWT_EXPIRATION!,
      // Run swagger only in development mode
      RUN_SWAGGER: process.env.NODE_ENV === 'development',
      // Log to console prettified by default
      LOG_TARGET: (process.env.LOG_TARGET as LogTarget) || LogTarget.PINO_PRETTY,
      // Log level is set to INFO by default
      LOG_LEVEL: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    },
  };

  return config;
};
