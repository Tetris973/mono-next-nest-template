import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm, ProfileFormProps } from '@web/app/auth/profile/ProfileForm';
import { mockUsers } from '@webRoot/test/common/unit-test/mocks/users.mock';
import { fn } from '@storybook/test';
import { useForm, UseFormReturnType } from '@mantine/form';
import { UpdateUserDto } from '@web/lib/backend-api/index';
import { profileFormSchema } from '@web/app/auth/profile/validation';
import { zodResolver } from 'mantine-form-zod-resolver';

const meta = {
  title: 'Components/ProfileForm',
  component: ProfileForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    useProfileForm: {
      table: {
        defaultValue: {
          summary: 'mockUseProfileForm',
        },
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<ProfileFormProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUseProfileForm = (form: UseFormReturnType<UpdateUserDto>) => ({
  user: mockUsers[0],
  form,
  profilePending: false,
  submitPending: false,
  handleSubmit: async (values: UpdateUserDto) => {
    return { success: `Profile updated successfully with values: ${JSON.stringify(values)}` };
  },
});

const createMockForm = () =>
  useForm({
    initialValues: { username: mockUsers[0].username },
    validate: zodResolver(profileFormSchema),
  });

export const Default: Story = {
  args: {
    userId: 1,
    onCancel: fn(),
    onSubmitSuccess: fn(),
    useProfileForm: () => mockUseProfileForm(createMockForm()),
  },
};

export const FetchProfilePending: Story = {
  args: {
    ...Default.args,
    useProfileForm: () => ({
      ...mockUseProfileForm(createMockForm()),
      profilePending: true,
    }),
  },
};

export const WithErrors: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    const form = createMockForm();
    form.setFieldError('username', 'Username is required');
    return (
      <ProfileForm
        {...args}
        useProfileForm={() => mockUseProfileForm(form)}
      />
    );
  },
};

export const SubmitPending: Story = {
  args: {
    ...Default.args,
    useProfileForm: () => ({
      ...mockUseProfileForm(createMockForm()),
      submitPending: true,
    }),
  },
};
