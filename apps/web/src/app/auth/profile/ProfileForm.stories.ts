import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm, ProfileFormProps } from '@web/app/auth/profile/ProfileForm';
import { UserDto } from '@dto/modules/user/dto/user.dto';

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

const mockUser: UserDto = {
  id: 1,
  username: 'testuser',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-06-15'),
};

const mockUseProfileForm = () => ({
  user: mockUser,
  profileError: {},
  newUsername: 'testuser',
  profilePending: false,
  submitPending: false,
  setNewUsername: () => {},
  handleSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return { success: 'Profile updated successfully' };
  },
});

export const Default: Story = {
  args: {
    userId: 1,
    onCancel: () => console.log('Cancel clicked'),
    onSubmitSuccess: () => console.log('Submit success'),
    useProfileForm: mockUseProfileForm,
  },
};

export const Loading: Story = {
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
      profileError: { username: ['Username is required'] },
    }),
  },
};

export const Submitting: Story = {
  args: {
    ...Default.args,
    useProfileForm: () => ({
      ...mockUseProfileForm(),
      submitPending: true,
    }),
  },
};
