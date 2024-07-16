import { ModuleMetadata } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TestLoggerModule } from '@testServer/utils/test-logger.module';
import { Logger } from 'nestjs-pino';

/**
 * Creates a TestingModuleBuilder with the TestLoggerModule included and logger set up.
 * This function facilitates the use of a custom logger in NestJS tests, allowing access to logs via memory.
 *
 * @param metadata - The module metadata for the test module, including imports, controllers, providers, and exports.
 * @returns A TestingModuleBuilder that can be further customized before compilation.
 *
 * @description
 * This function does the following:
 * 1. Creates a TestingModuleBuilder with the provided metadata and includes the TestLoggerModule.
 * 2. Overrides the compile method to set up the custom logger after module compilation.
 * 3. Replaces the default NestJS Logger with our custom Logger from nestjs-pino.
 *
 * The logger replacement works as follows:
 * - In the original code, services and controllers typically use the Logger from '@nestjs/common'.
 * - The TestLoggerModule provides a custom Logger (from nestjs-pino) that's configured for testing.
 * - When moduleRef.useLogger(logger) is called, it globally replaces the default Logger with our custom one.
 * - This replacement affects all components in the module that use Logger, including those from '@nestjs/common'.
 *
 * @example
 * ```ts
 * import { getTestLogs } from '@testServer/utils/test-logger.module';
 *
 * const module = await createTestingModuleWithLogger({
 *   providers: [UserService],
 * }).compile();
 *
 * // Your test code here
 *
 * const logs = getTestLogs();
 * expect(logs).toHaveLength(1);
 * expect(logs[0].level).toBe('info');
 * expect(logs[0].msg).toBe('Hello, world!');
 * ```
 *
 * @note
 * If you prefer not to use this custom function and want to add the logger manually, you can do so as follows:
 * ```ts
 * import { Test } from '@nestjs/testing';
 * import { TestLoggerModule } from '@testServer/utils/test-logger.module';
 * import { Logger } from 'nestjs-pino';
 *
 * const moduleRef = await Test.createTestingModule({
 *   imports: [TestLoggerModule, ...yourOtherImports],
 *   // ... other module metadata
 * }).compile();
 *
 * const logger = moduleRef.get<Logger>(Logger);
 * moduleRef.useLogger(logger);
 *
 * // Now you can use moduleRef in your tests
 * ```
 * This manual approach gives you more control over when and how the logger is set up,
 * while still allowing you to use the custom TestLoggerModule for capturing logs in tests.
 */
export function createTestingModuleWithLogger(metadata: ModuleMetadata): TestingModuleBuilder {
  const builder = Test.createTestingModule({
    imports: [TestLoggerModule, ...(metadata.imports || [])],
    controllers: metadata.controllers || [],
    providers: metadata.providers || [],
    exports: metadata.exports || [],
  });

  const originalCompile = builder.compile.bind(builder);

  builder.compile = async function (options?: Parameters<typeof originalCompile>[0]): Promise<TestingModule> {
    const moduleRef = await originalCompile(options);
    const logger = moduleRef.get(Logger);
    moduleRef.useLogger(logger);
    return moduleRef;
  };

  return builder;
}
