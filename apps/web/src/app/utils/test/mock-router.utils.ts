import { vi } from 'vitest';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/*
 * Mock the useRouter from next/navigation
 * Add elements when needed
 */
export const mockRouter: Partial<AppRouterInstance> = {
  push: vi.fn(),
};
