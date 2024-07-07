import { FormControl, FormLabel, FormErrorMessage, Input, Skeleton } from '@chakra-ui/react';
import React from 'react';

export interface ProfileFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  error: string[] | undefined;
  loading: boolean;
  isReadOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  id,
  label,
  name,
  value,
  error,
  loading,
  isReadOnly = false,
  onChange,
}) => {
  const renderInput = () => (
    <Input
      placeholder={label}
      name={name}
      _placeholder={{ color: 'gray.500' }}
      type="text"
      value={value}
      isReadOnly={isReadOnly}
      _readOnly={{ opacity: 0.6, cursor: 'not-allowed' }}
      onChange={onChange}
    />
  );

  const renderSkeleton = () => (
    <Skeleton
      height="40px"
      data-testid="profile-field-skeleton"
    />
  );

  return (
    <FormControl
      id={id}
      isInvalid={error && error.length > 0}
      isRequired={!isReadOnly}>
      <FormLabel>{label}</FormLabel>
      {loading ? renderSkeleton() : renderInput()}
      {error && error.map((error) => <FormErrorMessage key={error}>{error}</FormErrorMessage>)}
    </FormControl>
  );
};
