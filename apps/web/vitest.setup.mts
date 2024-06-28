// To extend the the expect object with jest-dom suach as toHaveAttribute
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
    /**
     * Unmounts React trees that were mounted with render, and cleanup the DOM
     * 
     * Failing to call cleanup when you've called render could result in a memory leak
     * and tests which are not "idempotent" (which can lead to difficult to debug errors in your tests)
     */
    cleanup();
});