import { Expose, plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  validateSync,
  Min,
  Max,
  IsOptional,
  Length,
  ValidationError,
  IsString,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { LogLevel, LogTarget } from './log.config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Schema for validating parsed environment variables
 * Variable that are not exposed with Exposed will be stripped from the object
 */
class EnvironmentVariables {
  @Expose()
  @IsEnum(Environment)
  readonly NODE_ENV!: Environment;

  @Expose()
  @IsOptional() // If not given it will defualt to 4000, see ./configuration.ts file
  @IsNumber()
  @Min(0)
  @Max(65535)
  readonly PORT!: number;

  @Expose()
  @Length(32)
  readonly JWT_SECRET!: string;

  @Expose()
  @IsString({
    message:
      'JWT_EXPIRATION must be a string of a format compatiable with npm package ms, e.g. 2 days, 1d, 10h, 2.5 hrs, -1h, ...',
  })
  readonly JWT_EXPIRATION!: string;

  @Expose()
  @IsOptional()
  @IsEnum(LogTarget)
  readonly LOG_TARGET?: LogTarget;

  @Expose()
  @IsOptional()
  @IsEnum(LogLevel)
  readonly LOG_LEVEL?: LogLevel;
}

/**
 * Format a validation error into a string
 * @param error - validation error
 * @returns - string with the error message
 */
function formatValidationError(error: ValidationError): string {
  if (error.children && error.children.length > 0) {
    return error.children.map((child) => formatValidationError(child)).join('\n');
  }

  const constraints = error.constraints ? Object.values(error.constraints) : [];
  return `${error.property}: ${constraints.join(', ')}! Value found: ${error.value}`;
}

/**
 * Function to validate environment variables
 * @param config - environment variables parsed from .env file
 * @returns - object with valid variable that that will be transformed into the ./configuration.ts object
 * @throws - error if validation fails
 */
export function validate(config: Record<string, unknown>) {
  const logger = new Logger(validate.name);
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });
  // Validate all before returning error
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  // Note: we are using the default Nest logger here because the pino logger is not available at this point in the application lifecycle
  if (errors.length > 0) {
    const errorMessages = errors.map((error) => formatValidationError(error)).join('\n');
    logger.fatal(`Configuration validation failed:\n${errorMessages}`);
    throw new Error(errorMessages);
  }

  // Be carreful to never display the value of the variables in the logs!
  logger.log(`Successfully loaded environment variables: ${Object.keys(validatedConfig).join(', ')}`);

  if (!validatedConfig.LOG_LEVEL || validatedConfig.LOG_LEVEL === LogLevel.SILENT) {
    logger.warn('Logging is set to SILENT. No logs will be output.');
  }
  if (!validatedConfig.LOG_TARGET) {
    logger.warn('The LOG_TARGET was not set so defaulting to PinoPretty');
  }
  return validatedConfig;
}
