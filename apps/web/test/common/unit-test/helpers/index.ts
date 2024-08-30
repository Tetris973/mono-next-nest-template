/**
 * Uility file to export all the testing utils from one file.
 * So that import is easier when using them.
 */

import userEvent from '@testing-library/user-event';

export * from '@testing-library/react';
export { render } from './render.helpers';
export { userEvent };
