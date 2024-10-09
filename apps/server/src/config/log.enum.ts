/**
 * Enumeration of available log levels.
 *
 * Log levels are hierarchical. When you set a log level, you'll see logs of that level and all levels above it.
 * The order is: TRACE > DEBUG > INFO > WARN > ERROR > FATAL > SILENT
 *
 * For example:
 * - If set to TRACE, all log levels will be visible.
 * - If set to WARN, only WARN, ERROR, and FATAL logs will be visible.
 * - If set to SILENT, no logs will be output.
 */
export enum LogLevel {
  /**
   * The most verbose level, used for tracing program execution.
   * Use for extremely detailed debugging, function entry/exit points, or variable values in loops.
   * @example logger.trace({ items, discount }, 'Entering function calculateTotal');
   */
  TRACE = 'trace',

  /**
   * For debugging information.
   * Use for information that is diagnostically helpful to developers.
   * @example logger.debug({ username, ipAddress }, 'User authentication attempt');
   */
  DEBUG = 'debug',

  /**
   * For general informational messages.
   * Use for normal operation events, such as service start/stop or configuration assumptions.
   * @example logger.info({ port: 3000 }, 'Application started successfully');
   */
  INFO = 'info',

  /**
   * For warnings that do not interrupt normal operation but might require attention.
   * Use for deprecated features, automatically handled errors, or suboptimal choices.
   * @example logger.warn({ currentConnections, maxConnections }, 'Database connection pool is nearing capacity');
   */
  WARN = 'warn',

  /**
   * For error messages indicating a problem that occurred.
   * Use for errors that prevent normal operation but don't crash the application.
   * @example logger.error({ orderId, errorMessage }, 'Failed to process payment');
   */
  ERROR = 'error',

  /**
   * For critical issues that require immediate attention.
   * Use for errors that will cause the application to crash or become unusable.
   * @example logger.fatal({ error }, 'Database connection failed, shutting down application');
   */
  FATAL = 'fatal',

  /**
   * Logs nothing.
   * Use when you want to completely disable logging.
   * @example // No logs will be output
   */
  SILENT = 'silent',
}

/**
 * Enumeration of available log targets for Pino.
 *
 * Log targets define where the log output will be directed. This can be useful for
 * configuring different logging strategies for development and production environments.
 */
export enum LogTarget {
  /**
   * Pretty-prints the logs for better readability during development.
   * Use this target when you want to see well-formatted logs in the console.
   * @example loggerConfig: { target: LogTarget.PinoPretty, options: { colorize: true, singleLine: true } }
   */
  PINO_PRETTY = 'pino-pretty',

  /**
   * Directs the logs to a file, useful for production environments where logs need to be persisted.
   * Use this target when you want to save logs to a file for later analysis.
   * @example loggerConfig: { target: LogTarget.PinoFile, options: { destination: '/var/log/app.log', mkdir: true } }
   */
  PINO_FILE = 'pino/file',

  /**
   * Pretty-prints the logs for better readability during development and saves them to a file.
   * Use this target when you want to see well-formatted logs in the console and save them to a file for later analysis.
   */
  PINO_PRETTY_AND_FILE = 'pino-pretty-and-file',

  /**
   * Uses default Pino logging (without pretty-printing) for console output and saves logs to a file.
   * Ideal for production environments where pino-pretty is not available.
   */
  PINO_DEFAULT_AND_FILE = 'pino-default-and-file',
}
