import { beforeEach } from 'vitest';
import { resetDatabase } from './resetDatabase';

beforeEach(async () => {
  await resetDatabase();
});
