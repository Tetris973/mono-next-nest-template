import { FormControl, FormLabel, FormErrorMessage, Input, Skeleton } from '@chakra-ui/react';

interface UsernameFieldProps {
  id: string;
  label: string;
  type: string;
  name: string;
  error: string[] | undefined;
  loading: boolean;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({ id, label, type, name, error, loading }) => (
  <FormControl
    id={id}
    isInvalid={error && error.length > 0}>
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
