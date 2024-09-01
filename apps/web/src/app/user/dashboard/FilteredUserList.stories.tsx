import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FilteredUserList, FilteredUserListProps } from '@web/app/user/dashboard/FilteredUserList';
import { mockUsers } from '@testWeb/common/unit-test/mocks/users.mock';

const meta = {
  title: 'Components/UserList',
  component: FilteredUserList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<FilteredUserListProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedUserId: undefined,
    onUserSelect: fn(),
    users: mockUsers,
    isLoading: false,
    error: undefined,
  },
};

export const WithSelectUserHook: Story = {
  args: {
    ...Default.args,
    selectedUserId: 1,
    onUserSelect: fn(),
  },
  render: (args) => {
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
    return (
      <FilteredUserList
        {...args}
        selectedUserId={selectedUserId}
        onUserSelect={setSelectedUserId}
      />
    );
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: 'Failed to fetch users',
  },
};

export const ManyUsers: Story = {
  args: {
    ...Default.args,
    users: Array(50)
      .fill(null)
      .map((_, index) => ({
        id: index + 1,
        username: `user${index + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
  },
};
