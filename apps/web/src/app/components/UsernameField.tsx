import { FormControl, FormLabel, FormErrorMessage, Input, Skeleton } from '@chakra-ui/react';

export interface UsernameFieldProps {
  id: string;
  label: string;
  type: string;
  name: string;
  error: string[] | undefined;
  loading: boolean;
  autoComplete?: string;
}

export const UsernameField: React.FC<UsernameFieldProps> = ({
  id,
  label,
  type,
  name,
  error,
  loading,
  autoComplete = 'username',
}) => {
  const renderSkeleton = () => (
    <Skeleton
      height="40px"
      data-testid="field-skeleton-loader"
    />
  );

  const renderInput = () => (
    <Input
      type={type}
      name={name}
      autoComplete={autoComplete}
    />
  );

  return (
    <FormControl
      id={id}
      isInvalid={error && error.length > 0}>
      <FormLabel>{label}</FormLabel>
      {loading ? renderSkeleton() : renderInput()}
      {error && error.map((error) => <FormErrorMessage key={error}>{error}</FormErrorMessage>)}
    </FormControl>
  );
};
