import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm, LoginFormProps } from '@web/app/auth/login/LoginForm';
import { UseLogin } from '@web/app/auth/login/login.hook';
import { loginFormSchema, LoginFormValues } from '@web/app/auth/login/validation';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm, UseFormReturnType } from '@mantine/form';
import { LoginUserDto } from '@web/lib/backend-api/index';

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

const mockUseLogin = (form: UseFormReturnType<LoginUserDto>): UseLogin => ({
  form,
  authLoading: false,
  handleSubmit: async (loginDto: LoginUserDto) => {
    return { success: `Login successful with values: ${JSON.stringify(loginDto)}` };
  },
});

const createMockForm = () =>
  useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    validate: zodResolver(loginFormSchema),
  });

export const Default: Story = {
  args: {
    useLogin: () => mockUseLogin(createMockForm()),
  },
};

export const Loading: Story = {
  args: {
    useLogin: () => ({
      ...mockUseLogin(createMockForm()),
      authLoading: true,
    }),
  },
};

export const WithErrors: Story = {
  render: (args) => {
    const form = createMockForm();
    // If we use form.setErrors, there is an infinite re-rendering!
    form.setFieldError('username', 'Username is required');
    form.setFieldError('password', 'Password is required');
    return (
      <LoginForm
        {...args}
        useLogin={() => mockUseLogin(form)}
      />
    );
  },
};

export const SubmissionError: Story = {
  args: {
    useLogin: () => ({
      ...mockUseLogin(createMockForm()),
      handleSubmit: async () => {
        return { error: 'Invalid credentials' };
      },
    }),
  },
};
