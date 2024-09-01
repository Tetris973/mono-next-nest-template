import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@web/components/Header';
import { mockUsers } from '@testWeb/common/unit-test/mocks/users.mock';
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    useAuth: {
      table: {
        defaultValue: {
          summary: 'mockUseAuth',
        },
      },
    },
    useProfile: {
      table: {
        defaultValue: {
          summary: 'mockUseProfile',
        },
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBaseAuth = {
  isAuthenticated: true,
  logout: fn(),
  login: fn(),
  roles: [],
  loading: false,
};

const mockBaseProfile = {
  profile: mockUsers[0],
  loading: false,
  loadProfile: fn(),
};

export const Authenticated: Story = {
  args: {
    useAuth: () => mockBaseAuth,
    useProfile: () => mockBaseProfile,
  },
};

export const Unauthenticated: Story = {
  args: {
    useAuth: () => ({ ...mockBaseAuth, isAuthenticated: false }),
    useProfile: () => ({ ...mockBaseProfile, profile: null }),
  },
};

export const Loading: Story = {
  args: {
    useAuth: () => ({ ...mockBaseAuth, isAuthenticated: undefined }),
    useProfile: () => ({ ...mockBaseProfile, loading: true }),
  },
};
