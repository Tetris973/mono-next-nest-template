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

  const outputPath = path.join(__dirname, 'openapi.json');

  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.close();
  console.log(`OpenAPI JSON generated successfully at ${outputPath}`);
}

if (require.main === module) {
  generateOpenAPI();
}

export { generateOpenAPI };
