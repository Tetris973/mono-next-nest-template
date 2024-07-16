import { vi } from 'vitest';
import { ToastUtils } from '@web/app/utils/toast-utils.use';

/**
 * This is a mock implementation of the toast utils. It is used to mock the toast utils in the test environment.
 * the return value of useCustomToast is done globaly in the vitest.setup.mts
 */
export const mockToast: ToastUtils = {
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  toastInfo: vi.fn(),
  toastWarning: vi.fn(),
  closeAllToasts: vi.fn(),
};
