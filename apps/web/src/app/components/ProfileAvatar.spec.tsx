import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { ProfileAvatar } from './ProfileAvatar';

describe('ProfileAvatar', () => {
  const defaultProps = {
    username: 'testuser',
    loading: false,
  };

  it('renders the component', () => {
    render(<ProfileAvatar {...defaultProps} />);
    // Nothing to test for the moment
  });
});
