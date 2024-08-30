import { beforeEach } from 'vitest';
import { resetDatabase } from './common/helpers/reset-database.helpers';

beforeEach(async () => {
  await resetDatabase();
});
