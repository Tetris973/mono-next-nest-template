import { DefaultApi, ConfigurationParameters, Configuration } from 'backend-api-sdk';
import { getConfig } from '@web/config/configuration';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

const configParams: ConfigurationParameters = {
  basePath: getConfig().BACKEND_URL,
  middleware: [authMiddleware, errorMiddleware],
};
const config = new Configuration(configParams);

export const backendApi = new DefaultApi(config);
