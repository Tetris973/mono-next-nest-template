import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@web/app/components/Header';
import { UserDto } from '@dto/user/dto/user.dto';
import { AuthContextInterface } from '@web/app/auth/AuthContext';
import { ProfileContextInterface } from '@web/app/auth/ProfileContext';

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

const mockUser: UserDto = {
  id: 1,
  username: 'testuser',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-06-15'),
};

const mockBaseAuth = {
  isAuthenticated: true,
  logout: () => console.log('Logout clicked'),
  login: () => console.log('Login clicked'),
  roles: [],
  loading: false,
};

const mockBaseProfile = {
  profile: mockUser,
  loading: false,
};

export const Authenticated: Story = {
  args: {
    useAuth: () => ({ ...mockBaseAuth, isAuthenticated: true }) as unknown as AuthContextInterface,
    useProfile: () => mockBaseProfile as unknown as ProfileContextInterface,
  },
};

export const Unauthenticated: Story = {
  args: {
    useAuth: () => ({ ...mockBaseAuth, isAuthenticated: false }) as unknown as AuthContextInterface,
    useProfile: () => ({ ...mockBaseProfile, profile: null }) as unknown as ProfileContextInterface,
  },
};

export const Loading: Story = {
  args: {
    useAuth: () => ({ ...mockBaseAuth, isAuthenticated: undefined }) as unknown as AuthContextInterface,
    useProfile: () => ({ ...mockBaseProfile, loading: true }) as unknown as ProfileContextInterface,
  },
};
