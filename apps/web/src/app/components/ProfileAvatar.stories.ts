import type { Meta, StoryObj } from '@storybook/react';
import { ProfileAvatar, ProfileAvatarProps } from '@web/app/components/ProfileAvatar';

const meta = {
  title: 'Components/ProfileAvatar',
  component: ProfileAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<ProfileAvatarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: 'johndoe',
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    username: '',
    loading: true,
  },
};
