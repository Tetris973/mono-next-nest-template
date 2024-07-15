import { getConfig, getBrowserConfig } from './config/configuration';
import { getLogger } from './lib/logger';

export function register() {
  // To prevent the middleware from calling again the loading of the configuration
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  }
  try {
    const config = getConfig(); // Load the configuration singleton
    getBrowserConfig(); // Load the browser configuration singleton
    const logger = getLogger('instrumentation');

    logger.info({ config: Object.keys(config) }, 'Configuration loaded');
    logger.info('Instrumentation successfully initialized');
  } catch (error) {
    if (error instanceof Error) {
      // Can't use logger here because it may not be initialized yet
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
