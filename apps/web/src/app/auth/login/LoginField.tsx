import { FormControl, FormLabel, FormErrorMessage, Input, Skeleton } from '@chakra-ui/react';

interface LoginFieldProps {
  id: string;
  label: string;
  type: string;
  name: string;
  error: string;
  loading: boolean;
}

export const LoginField: React.FC<LoginFieldProps> = ({ id, label, type, name, error, loading }) => (
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
