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
    label: 'Username',
    value: 'johndoe',
    error: undefined,
    loading: false,
    onChange: (e) => console.log('Value changed:', e.target.value),
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
