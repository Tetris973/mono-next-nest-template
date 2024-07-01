import type { Meta, StoryObj } from '@storybook/react';
import { PasswordField, PasswordFieldProps } from '@web/app/components/PasswordField';
import { useState } from 'react';

const meta = {
  title: 'Components/PasswordField',
  component: PasswordField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<PasswordFieldProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'password',
    label: 'Password',
    name: 'password',
    error: undefined,
    loading: false,
    showPassword: false,
    setShowPassword: () => {},
  },
  render: (args) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <PasswordField
        {...args}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    );
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: ['Password is required', 'second error'],
  },
  render: Default.render,
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
  render: Default.render,
};

export const Visible: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    const [showPassword, setShowPassword] = useState(true);
    return (
      <PasswordField
        {...args}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    );
  },
};
