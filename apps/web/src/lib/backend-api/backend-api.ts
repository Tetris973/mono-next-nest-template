import { DefaultApi, ConfigurationParameters, Configuration } from 'backend-api-sdk';
import { getServerConfig } from '@web/config/configuration';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

const configParams: ConfigurationParameters = {
  basePath: getServerConfig().BACKEND_URL,
  middleware: [authMiddleware, errorMiddleware],
};
const config = new Configuration(configParams);

export const backendApi = new DefaultApi(config);
