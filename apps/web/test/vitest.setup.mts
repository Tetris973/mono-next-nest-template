// To extend the the expect object with jest-dom suach as toHaveAttribute
import '@testing-library/jest-dom/vitest'
import { afterEach, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { checkAuthentication } from '@web/common/helpers/check-authentication.helpers';
import { mockRouter } from '@testWeb/common/unit-test/mocks/router.mock';
import { getLogger, clearLogs, getLogs } from '@webRoot/test/common/unit-test/helpers/test-logger.helper';
import { mockGetConfig } from '@testWeb/common/unit-test/mocks/config.mock';
import { getServerConfig } from '@web/config/configuration';
import { backendApi } from '@web/lib/backend-api/backend-api';
import { cookies } from 'next/headers';

vi.mock('next/headers');
vi.mock('@web/lib/backend-api/backend-api')


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
    getServerConfig: mockGetConfig,
}));

vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
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
vi.mock('@web/common/helpers/check-authentication.helpers', () => ({
    checkAuthentication: vi.fn().mockImplementation(mockCheckAuthentication),
}));

beforeEach(() => {
  /**
   * Reset all mocked function of the backendApi
   */
    Object.values(backendApi).forEach((func) => {
        if (typeof func === 'function' && vi.isMockFunction(func)) {
          vi.mocked(func).mockReset();
        }
    });

    /**
     * Reset the mock for the cookies from next/headers
     */
    vi.mocked(cookies).mockReset();

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