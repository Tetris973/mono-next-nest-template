import type { Meta, StoryObj } from '@storybook/react';
import { ProfileField } from '@web/app/components/ProfileField';

const meta = {
  title: 'Components/ProfileField',
  component: ProfileField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'username',
    label: 'Username',
    name: 'username',
    value: 'johndoe',
    error: undefined,
    loading: false,
    isReadOnly: false,
    onChange: (e) => console.log('Value changed:', e.target.value),
  },
};

export const ReadOnly: Story = {
  args: {
    ...Default.args,
    isReadOnly: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: ['This field is required'],
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const LongValue: Story = {
  args: {
    ...Default.args,
    value: 'johndoewithaveryverylongusername',
  },
};
