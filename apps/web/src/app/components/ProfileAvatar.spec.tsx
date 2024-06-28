import { describe, it, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { ProfileAvatar } from './ProfileAvatar';

describe('ProfileAvatar', () => {
  const defaultProps = {
    username: 'testuser',
    loading: false,
  };

  beforeEach(() => {
    cleanup();
  });

  it('renders the component', () => {
    render(<ProfileAvatar {...defaultProps} />);
    // Nothing to test for the moment
  });
});
