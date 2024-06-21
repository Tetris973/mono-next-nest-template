import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, validateSync, Min, Max, IsOptional, Length } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/**
 * Schema for validating parsed environment variables
 */
class EnvironmentVariables {
  @IsEnum(Environment)
  readonly NODE_ENV!: Environment;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(65535)
  readonly PORT!: number;

  @Length(32)
  readonly JWT_SECRET!: string;
}

/**
 * Function to validate environment variables
 * @param config - environment variables parsed from .env file
 * @returns - object with valid variable that that will be transformed into the configuration.ts object
 * @throws - error if validation fails
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
