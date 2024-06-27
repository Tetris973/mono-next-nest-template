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
}) => (
  <FormControl
    id={id}
    isInvalid={error && error.length > 0}>
    <FormLabel>{label}</FormLabel>
    {loading ? (
      <Skeleton height="40px" />
    ) : (
      <InputGroup>
        <Input
          type={showPassword ? 'text' : 'password'}
          name={name}
        />
        <InputRightElement h={'full'}>
          <Button
            variant={'ghost'}
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
          </Button>
        </InputRightElement>
      </InputGroup>
    )}
    <FormErrorMessage>{error}</FormErrorMessage>
  </FormControl>
);
