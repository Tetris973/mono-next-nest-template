import React from 'react';
import { TextInput, Skeleton, type TextInputProps } from '@mantine/core';

export interface ProfileFieldProps extends Omit<TextInputProps, 'loading'> {
  loading?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({ loading = false, onChange, ...rest }) => {
  return (
    <Skeleton
      visible={loading}
      data-testid="profile-field-skeleton">
      <TextInput
        {...rest}
        onChange={onChange}
      />
    </Skeleton>
  );
};
