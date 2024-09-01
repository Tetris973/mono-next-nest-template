import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm, ProfileFormProps } from '@web/app/auth/profile/ProfileForm';
import { mockUsers } from '@webRoot/test/common/unit-test/mocks/users.mock';
import { fn } from '@storybook/test';

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

const mockUseProfileForm = () => ({
  user: mockUsers[0],
  profileError: {},
  profilePending: false,
  submitPending: false,
  handleSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return { success: 'Profile updated successfully' };
  },
});

export const Default: Story = {
  args: {
    userId: 1,
    onCancel: fn(),
    onSubmitSuccess: fn(),
    useProfileForm: mockUseProfileForm,
  },
};

export const FetchProfilePending: Story = {
  args: {
    ...Default.args,
    useProfileForm: () => ({
      ...mockUseProfileForm(),
      profilePending: true,
    }),
  },
};

export const WithErrors: Story = {
  args: {
    ...Default.args,
    useProfileForm: () => ({
      ...mockUseProfileForm(),
      user: {
        ...mockUsers[0],
        username: '',
      },
      profileError: { username: ['Username is required'] },
    }),
  },
};

export const SubmitPending: Story = {
  args: {
    ...Default.args,
    useProfileForm: () => ({
      ...mockUseProfileForm(),
      submitPending: true,
    }),
  },
};
