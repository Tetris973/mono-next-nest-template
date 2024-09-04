import type { Meta, StoryObj } from '@storybook/react';
import { SignupForm, SignupFormProps } from '@web/app/auth/signup/SignupForm';
import { UseSignup } from '@web/app/auth/signup/signup.hook';
import { CreateUserDto } from '@web/common/dto/backend-index.dto';
import { UseFormReturnType, useForm } from '@mantine/form';
import { signupFormSchema, SignupFormValues } from '@web/app/auth/signup/validation';
import { zodResolver } from 'mantine-form-zod-resolver';

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

const mockUseSignup = (form: UseFormReturnType<CreateUserDto>): UseSignup => ({
  form,
  handleSubmit: async (createUserDto: CreateUserDto) => {
    return { success: `Signup successful with data: ${JSON.stringify(createUserDto)}` };
  },
  signupPending: false,
});

const createMockForm = () =>
  useForm<SignupFormValues>({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validate: zodResolver(signupFormSchema),
  });

export const Default: Story = {
  args: {
    useSignup: () => mockUseSignup(createMockForm()),
  },
};

export const Loading: Story = {
  args: {
    useSignup: () => ({
      ...mockUseSignup(createMockForm()),
      signupPending: true,
    }),
  },
};

export const WithErrors: Story = {
  render: (args) => {
    const form = createMockForm();
    form.setFieldError('username', 'Username is required');
    form.setFieldError('password', 'Password is too short');
    form.setFieldError('confirmPassword', 'Passwords do not match');
    return (
      <SignupForm
        {...args}
        useSignup={() => mockUseSignup(form)}
      />
    );
  },
};
