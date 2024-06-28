import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormErrorMessage,
  Skeleton,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface PasswordFieldProps {
  id: string;
  label: string;
  name: string;
  error: string[] | undefined;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  name,
  error,
  loading,
  showPassword,
  setShowPassword,
}) => {
  const renderSkeleton = () => (
    <Skeleton
      height="40px"
      data-testid="skeleton-loader"
    />
  );

  const renderInputGroup = () => (
    <InputGroup>
      <Input
        type={showPassword ? 'text' : 'password'}
        name={name}
        data-testid="password-input"
      />
      <InputRightElement h={'full'}>
        <Button
          variant={'ghost'}
          onClick={() => setShowPassword(!showPassword)}
          data-testid="toggle-button">
          {showPassword ? (
            <FontAwesomeIcon
              icon={faEye}
              data-testid="eye-icon"
            />
          ) : (
            <FontAwesomeIcon
              icon={faEyeSlash}
              data-testid="eye-slash-icon"
            />
          )}
        </Button>
      </InputRightElement>
    </InputGroup>
  );

  return (
    <FormControl
      id={id}
      isInvalid={error && error.length > 0}
      data-testid="password-field">
      <FormLabel>{label}</FormLabel>
      {loading ? renderSkeleton() : renderInputGroup()}
      {error && error.map((error) => <FormErrorMessage key={error}>{error}</FormErrorMessage>)}
    </FormControl>
  );
};
