import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm, LoginFormProps } from '@web/app/auth/login/LoginForm';
import { UseLogin } from '@web/app/auth/login/login.use';

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    useLogin: {
      table: {
        defaultValue: {
          summary: 'mockUseLogin',
        },
      },
    },
  },
} satisfies Meta<LoginFormProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUseLogin = (): UseLogin => ({
  error: {},
  authLoading: false,
  handleSubmit: async (event) => {
    event.preventDefault();
    return { success: 'Login successful' };
  },
});

export const Default: Story = {
  args: {
    useLogin: mockUseLogin,
  },
};

export const Loading: Story = {
  args: {
    useLogin: () => ({
      ...mockUseLogin(),
      authLoading: true,
    }),
  },
};

export const WithErrors: Story = {
  args: {
    useLogin: () => ({
      ...mockUseLogin(),
      error: {
        username: ['Username is required'],
        password: ['Password must be at least 8 characters'],
      },
    }),
  },
};

export const SubmissionError: Story = {
  args: {
    useLogin: () => ({
      ...mockUseLogin(),
      handleSubmit: async (event) => {
        event.preventDefault();
        return { error: 'Invalid credentials' };
      },
    }),
  },
};
