import { Box, Button, Stack, useColorModeValue, Spinner, Text, Link } from '@chakra-ui/react';
import { UseSignup, useSignup as defaultUseSignup } from './signup.use';
import { PasswordInput, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showSuccessNotification, showErrorNotification } from '@web/app/utils/notifications';
import { useRouter } from 'next/navigation';

export interface SignupFormProps {
  useSignup?: () => UseSignup;
}

export const SignupForm: React.FC<SignupFormProps> = ({ useSignup = defaultUseSignup }) => {
  const { error, handleSubmit, signupPending } = useSignup();
  const router = useRouter();

  const [passwordVisible, { toggle: togglePassword }] = useDisclosure(false);

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
          <TextInput
            id="username"
            label="Username"
            type="text"
            name="username"
            error={Array.isArray(error.username) ? error.username.join(', ') : error.username}
            autoComplete="username"
          />
          <PasswordInput
            id="password"
            label="Password"
            name="password"
            error={Array.isArray(error.password) ? error.password.join(', ') : error.password}
            visible={passwordVisible}
            onVisibilityChange={togglePassword}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            error={Array.isArray(error.confirmPassword) ? error.confirmPassword.join(', ') : error.confirmPassword}
            visible={passwordVisible}
            onVisibilityChange={togglePassword}
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
