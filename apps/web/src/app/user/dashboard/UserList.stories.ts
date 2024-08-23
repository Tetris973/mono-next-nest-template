import type { Meta, StoryObj } from '@storybook/react';
import { UserList, UserListProps } from '@web/app/user/dashboard/UserList';
import { UserDto } from '@dto/user/dto/user.dto';

const meta = {
  title: 'Components/UserList',
  component: UserList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<UserListProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUsers: UserDto[] = [
  {
    id: 1,
    username: 'johndoe',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-15'),
  },
  {
    id: 2,
    username: 'janedoe',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-06-20'),
  },
  {
    id: 3,
    username: 'bobsmith',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-06-25'),
  },
  {
    id: 4,
    username: 'alicejohnson',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-06-30'),
  },
  {
    id: 5,
    username: 'charliebrownwithaveryverylongusername',
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-07-05'),
  },
];

export const Default: Story = {
  args: {
    users: mockUsers,
    loading: false,
    error: null,
    onUserSelect: (id) => console.log('Selected user:', id),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
    users: [],
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Failed to load users',
    users: [],
  },
};

export const EmptyList: Story = {
  args: {
    ...Default.args,
    users: [],
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
