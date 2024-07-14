import { getConfig } from './config/configuration';
import { initializeLogger } from './lib/logger';

export function register() {
  try {
    getConfig(); // First call to load the confiruation singleton
    initializeLogger();
    console.log('Instrumentation successfully initialized');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Instrumentation failed:', error.message);
      // Check if the error is a result of a validation error from Zod and display the issues
      if ('issues' in error) {
        (error as any).issues.forEach((issue: any) => {
          console.error(`- ${issue.path.join('.')}: ${issue.message}`);
        });
      }
    }
    process.exit(1);
  }
}
