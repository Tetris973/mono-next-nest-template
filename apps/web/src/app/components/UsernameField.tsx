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
    isInvalid={error && error.length > 0}
    data-testid="username-field">
    <FormLabel>{label}</FormLabel>
    {loading ? (
      <Skeleton
        height="40px"
        data-testid="skeleton-loader"
      />
    ) : (
      <Input
        type={type}
        name={name}
        data-testid="username-input"
      />
    )}
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);
