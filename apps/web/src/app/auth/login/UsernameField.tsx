import { FormControl, FormLabel, FormErrorMessage, Input, Skeleton } from '@chakra-ui/react';

interface UsernameFieldProps {
  id: string;
  label: string;
  type: string;
  name: string;
  error: string;
  loading: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ id, label, type, name, error, loading }) => (
  <FormControl
    id={id}
    isInvalid={!!error}>
    <FormLabel>{label}</FormLabel>
    {loading ? (
      <Skeleton height="40px" />
    ) : (
      <Input
        type={type}
        name={name}
      />
    )}
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);
