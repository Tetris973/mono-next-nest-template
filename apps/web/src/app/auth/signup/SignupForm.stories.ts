import type { Meta, StoryObj } from '@storybook/react';
import { SignupForm, SignupFormProps } from '@web/app/auth/signup/SignupForm';

const meta = {
  title: 'Components/SignupForm',
  component: SignupForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    useSignup: {
      table: {
        defaultValue: {
          summary: 'mockUseSignup',
        },
      },
    },
  },
} satisfies Meta<SignupFormProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUseSignup = () => ({
  error: {},
  showPassword: false,
  setShowPassword: () => {},
  handleSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return { success: 'Signup successful' };
  },
  signupPending: false,
});

export const Default: Story = {
  args: {
    useSignup: mockUseSignup,
  },
};

export const Loading: Story = {
  args: {
    useSignup: () => ({
      ...mockUseSignup(),
      signupPending: true,
    }),
  },
};

export const WithErrors: Story = {
  args: {
    useSignup: () => ({
      ...mockUseSignup(),
      error: {
        username: ['Username is required'],
        password: ['Password is too short'],
        confirmPassword: ['Passwords do not match'],
      },
    }),
  },
};

export const PasswordVisible: Story = {
  args: {
    useSignup: () => ({
      ...mockUseSignup(),
      showPassword: true,
    }),
  },
};
