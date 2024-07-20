import { getConfig, getBrowserConfig, ConfigError } from './config/configuration';
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
    if (error instanceof ConfigError) {
      console.error('Instrumentation failed:\n', error.getIssuesString());
    }
    process.exit(1);
  }
}
