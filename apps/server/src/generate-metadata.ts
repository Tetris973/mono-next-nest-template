import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';

/**
 * Generates metadata for NestJS plugins, specifically for Swagger documentation.
 * This script is typically run as part of the build process or development setup.
 *
 * It uses the NestJS CLI's PluginMetadataGenerator to create metadata that enhances
 * the Swagger documentation with additional information from the source code.
 *
 */

const generator = new PluginMetadataGenerator();
generator.generate({
  visitors: [
    // Swagger plugin visitor for introspecting comments and generating metadata
    new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname }),
  ],
  outputDir: __dirname,
  watch: true,
  // Specifies the path to tsconfig.json from the root of the monorepo
  tsconfigPath: 'apps/server/tsconfig.json',
});
