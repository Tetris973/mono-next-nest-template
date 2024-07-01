import type { Meta, StoryObj } from '@storybook/react';
import { UsernameField, UsernameFieldProps } from '@web/app/components/UsernameField';

const meta = {
  title: 'Components/UsernameField',
  component: UsernameField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<UsernameFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'username',
    label: 'Username',
    type: 'text',
    name: 'username',
    error: undefined,
    loading: false,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: ['Username is required', 'Username must be at least 3 characters'],
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const Email: Story = {
  args: {
    ...Default.args,
    label: 'Email',
    type: 'email',
    name: 'email',
  },
};
