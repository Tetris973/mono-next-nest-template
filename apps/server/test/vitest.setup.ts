import { beforeEach } from 'vitest';
import { resetDatabase } from './utils/resetDatabase';

beforeEach(async () => {
  await resetDatabase();
});
