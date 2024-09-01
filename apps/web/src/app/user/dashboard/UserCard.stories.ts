import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UserCard, UserCardProps } from '@web/app/user/dashboard/UserCard';
import { mockUsers } from '@testWeb/common/unit-test/mocks/users.mock';

const meta = {
  title: 'Components/UserCard',
  component: UserCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<UserCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: mockUsers[0],
    loading: false,
    showAdmin: false,
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const AdminView: Story = {
  args: {
    ...Default.args,
    showAdmin: true,
  },
};

export const NoUser: Story = {
  args: {
    ...Default.args,
    user: null,
  },
};

const longUser = { ...mockUsers[0] };
longUser.username = 'verylongusernameverylongusernamevery';
export const LongUserDetails: Story = {
  args: {
    ...Default.args,
    user: longUser,
  },
};
