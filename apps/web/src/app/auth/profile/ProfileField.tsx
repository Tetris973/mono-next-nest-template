import { FormControl, FormLabel, FormErrorMessage, Input, Skeleton } from '@chakra-ui/react';

interface ProfileFieldProps {
  id: string;
  label: string;
  value: string;
  error: string;
  loading: boolean;
  isReadOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  id,
  label,
  value,
  error,
  loading,
  isReadOnly = false,
  onChange,
}) => (
  <FormControl
    id={id}
    isInvalid={!!error}
    isRequired={!isReadOnly}>
    <FormLabel>{label}</FormLabel>
    {loading ? (
      <Skeleton height="40px" />
    ) : (
      <Input
        placeholder={label}
        _placeholder={{ color: 'gray.500' }}
        type="text"
        value={value}
        isReadOnly={isReadOnly}
        _readOnly={{ opacity: 0.6, cursor: 'not-allowed' }}
        onChange={onChange}
      />
    )}
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);

export default ProfileField;