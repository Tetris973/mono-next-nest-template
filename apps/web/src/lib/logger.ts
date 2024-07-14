import { getConfig } from '@web/config/configuration';
import { LogTarget } from '@server/config/log.config';

export function initializeLogger() {
  const { LOG_LEVEL, LOG_TARGET } = getConfig();

  console.log('Initializing logger');
  console.log(`> Log level: ${LOG_LEVEL}`);
  console.log(`> Log target: ${LOG_TARGET}`);

  // Implement actual logging initialization here
  if (LOG_TARGET === LogTarget.PinoFile) {
    console.log('Initializing file logging');
    // ... implementation for file logging
  } else {
    console.log('Initializing console logging');
    // ... implementation for console logging
  }
}
