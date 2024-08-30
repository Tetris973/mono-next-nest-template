import type { Meta, StoryObj } from '@storybook/react';
import { UserCard, UserCardProps } from '@web/app/user/dashboard/UserCard';
import { UserDto } from '@dto/modules/user/dto/user.dto';

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

const mockUser: UserDto = {
  id: 1,
  username: 'johndoe',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-06-15'),
};

export const Default: Story = {
  args: {
    user: mockUser,
    loading: false,
    onDelete: () => console.log('Delete clicked'),
    showAdmin: false,
    onEdit: () => console.log('Edit clicked'),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    user: null,
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

export const LongUsername: Story = {
  args: {
    ...Default.args,
    user: {
      ...mockUser,
      username: 'johndoewithaverylongusername',
    },
  },
};
