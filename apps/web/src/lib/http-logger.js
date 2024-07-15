const pino = require('pino');
const pinoHttp = require('pino-http');
const { join } = require('path');

function createPinoHttpLogger() {
    // To be able to use process.env at this point, we need to do like in nestjs and use dotenv to load the env file before
    // starting the command like this "dotenv -e .env.development.local -- next dev"

  const env = process.env.NODE_ENV;
  const isProduction = env === 'production';

  let transport;
  if (isProduction) {
    transport = {
      target: 'pino/file', // can't use process.env.LOG_TARGET because it's not available at the time of the import
      options: {
        destination: join(process.cwd(), 'logs', `${env}.http.log`),
        mkdir: true,
      },
    };
  } else {
    transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
      },
    };
  }

  const logger = pino({
    level: 'info', // process.env.LOG_LEVEL not available at the time of the import
    transport,
  });

  const pinoHttpMiddleware = pinoHttp({
    logger,
    // Customize the logging to map the status code to the correct log level
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return 'warn'
      if (res.statusCode >= 500 || err) return 'error'
      return 'info'
    },
  });

  return pinoHttpMiddleware;
}

module.exports = createPinoHttpLogger;