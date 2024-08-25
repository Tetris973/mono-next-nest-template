import { Box, Button, Stack, useColorModeValue, Spinner, Text, Link } from '@chakra-ui/react';
import { UseSignup, useSignup as defaultUseSignup } from './signup.use';
import { UsernameField } from '@web/app/components/UsernameField';
import { PasswordField } from '@web/app/components/PasswordField';
import { showSuccessNotification, showErrorNotification } from '@web/app/utils/notifications';
import { useRouter } from 'next/navigation';

export interface SignupFormProps {
  useSignup?: () => UseSignup;
}

export const SignupForm: React.FC<SignupFormProps> = ({ useSignup = defaultUseSignup }) => {
  const { error, showPassword, setShowPassword, handleSubmit, signupPending } = useSignup();
  const router = useRouter();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const result = await handleSubmit(event);
    if (result.error) {
      showErrorNotification({
        message: result.error,
      });
    } else if (result.success) {
      showSuccessNotification({
        message: result.success,
      });
      router.push('/auth/login');
    }
  };

  return (
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}>
      <form
        onSubmit={handleFormSubmit}
        aria-label="Sign up form">
        <Stack spacing={4}>
          <UsernameField
            id="username"
            label="Username"
            type="text"
            name="username"
            error={error.username}
            loading={signupPending}
          />
          <PasswordField
            id="password"
            label="Password"
            name="password"
            error={error.password}
            loading={signupPending}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            error={error.confirmPassword}
            loading={signupPending}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Stack spacing={10}>
            <Button
              type="submit"
              bg={'blue.400'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              isLoading={signupPending}
              isDisabled={signupPending}
              spinner={<Spinner />}
              aria-label="Sign up">
              Sign up
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
              Already a user?{' '}
              <Link
                href="/auth/login"
                color={'blue.400'}>
                Login
              </Link>
            </Text>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
