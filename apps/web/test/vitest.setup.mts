// To extend the the expect object with jest-dom suach as toHaveAttribute
import '@testing-library/jest-dom/vitest'
import { afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { safeFetch } from '@web/app/utils/safe-fetch.utils';
import { checkAuthentication } from '@web/app/utils/check-authentication.utils';
import { mockToast } from '@testWeb/utils/unit-test/mock-toast.utils';
import { mockRouter } from '@testWeb/utils/unit-test/mock-router.utils';
import { getLogger, clearLogs, getLogs } from '@testWeb/utils/unit-test/test-logger.utils';
import { mockGetConfig } from '@testWeb/utils/unit-test/mock-config.utils';
import { getConfig } from '@web/config/configuration';

/**
 * Configuration provided by mantine documentation https://mantine.dev/guides/vitest/#configuration
 * According to doc:
 * The code above mocks window.matchMedia and ResizeObserver APIs that are not available in jsdom environment but are required by some Mantine components.
 */
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// END OF MANTINE CONFIGURATION

vi.mock('@web/config/configuration', () => ({
    getConfig: mockGetConfig,
}));

vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
}));

vi.mock('@web/app/utils/toast-utils.use', () => ({
    useCustomToast: () => mockToast,
}));

vi.mock('@web/lib/logger', () => ({
  getLogger: vi.fn().mockImplementation((context?: string) => getLogger(context)),
}));

/**
 * Mock for utility function.
 * 
 * @description
 * By default, this mock is set up to throw an error. This behavior serves two purposes:
 * 1. It indicates that the utility function was called inside a function being tested.
 * 2. It signals that the return value of the utility function was not properly mocked in the test case.
 * 
 * @note
 * The utility function is mocked globally for the entire application. When writing tests that use
 * the utility function, you should explicitly mock its return value with data relevant to your test case.
 * This ensures that your tests are predictable and isolated from external dependencies.
 */
function exampleMock() {
    throw new Error('exampleMock was called but not mocked in this test, refer to the documentaion in vitest.setup.mts');
}

/**
 * Mock for the safeFetch utility function.
 * 
 * @see {@link exampleMock}
 * 
 * @example
 * // In your test file:
 * import { safeFetch } from '@web/app/utils/safe-fetch.utils';
 * import { vi } from 'vitest';
 * 
 * const mockData = {
 *   key: 'value',
 *   anotherKey: 123,
 * };
 * 
 * const mockResponse = {
 *   ok: true,
 *   json: vi.fn().mockResolvedValue(mockData),
 * };
 * 
 * (safeFetch as jest.Mock).mockResolvedValue(mockResponse);
 * 
 */
function mockSafeFetch() {
    throw new Error('safeFetch was called but not mocked in this test, refer to the documentaion in vitest.setup.mts');
}
vi.mock('@web/app/utils/safe-fetch.utils', () => ({
    safeFetch: vi.fn().mockImplementation(mockSafeFetch),
}));

/**
 * Mock for the checkAuthentication utility function.
 * 
 * @see {@link exampleMock}
 * 
 * @example
 * // In your test file:
 * import { checkAuthentication } from '@web/app/utils/check-authentication.utils';
 * import { vi } from 'vitest';
 * 
 * const mockToken = 'jwtToken'
 * 
 * (checkAuthentication as Mock).mockReturnValue({ result: mockToken })
 */
function mockCheckAuthentication() {
    throw new Error('checkAuthentication was called but not mocked in this test, refer to the documentaion in vitest.setup.mts');
}
vi.mock('@web/app/utils/check-authentication.utils', () => ({
    checkAuthentication: vi.fn().mockImplementation(mockCheckAuthentication),
}));

beforeEach(() => {
    /** 
     * Sometimes we mock the console.error because jsdom display error from component in the console as error even if catched, which pollutes the test output.
     * So to prevent forgetting about resetting the console.error, we reset it here before each test.
     * To check for the jsom error in test, use the following template
     * 
     * @example
     * const errorMessage = 'Error message';
     * const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
     * expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, expect.stringMatching(errorMessage), expect.any(Error));
     */
    vi.spyOn(console, 'error').mockRestore();

    /**
     * Clear the logs of the mock test-logger before each test
     */
    clearLogs();
});

afterEach(() => {
    /**
     * Unmounts React trees that were mounted with render, and cleanup the DOM
     * 
     * Failing to call cleanup when you've called render could result in a memory leak
     * and tests which are not "idempotent" (which can lead to difficult to debug errors in your tests)
     */
    cleanup();
});