import { NestFactory } from '@nestjs/core';
import { AppModule } from '@server/app.module';
import { setupSwagger } from './swagger.config';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenAPI() {
  const app = await NestFactory.create(AppModule);

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
