import { NestFactory } from '@nestjs/core';
import { AppModule } from '@server/app.module';
import { setupSwagger } from './swagger.config';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenAPI() {
  const app = await NestFactory.create(AppModule, {
    /**
     * Preview mode prevents instantiation and resolution of controllers and providers.
     * This is beneficial for OpenAPI schema generation as it:
     * 1. Avoids potential failures caused by unnecessary component initialization.
     * 2. Results in a lighter process, improving performance.
     * 3. Focuses solely on metadata required for schema generation.
     */
    preview: true,
  });

  const { document } = await setupSwagger(app);

  let outputPath = path.join(__dirname, 'openapi.json');

  // When using nestjs cli, it compiles and run the file from dist folder, but we need to save the file to src folder for git tracking.
  if (outputPath.includes('dist/')) {
    outputPath = outputPath.replace('dist/', 'src/');
  }

  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.close();
  console.log(`OpenAPI JSON generated successfully at ${outputPath}`);
}

if (require.main === module) {
  generateOpenAPI();
}

export { generateOpenAPI };
