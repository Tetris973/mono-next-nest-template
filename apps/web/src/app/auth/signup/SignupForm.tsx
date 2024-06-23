import { Box, Button, Stack, useColorModeValue, Spinner, Text, Link } from '@chakra-ui/react';
import { useSignup } from './signup.use';
import { UsernameField } from '@web/app/auth/login/UsernameField';
import { PasswordField } from '@web/app/auth/login/PasswordField';
import { useCustomToast } from '@web/app/utils/toast-utils.use';
import { useRouter } from 'next/navigation';

export const SignupForm: React.FC = () => {
  const { toastError, toastSuccess } = useCustomToast();
  const { error, showPassword, setShowPassword, handleSubmit, signupLoading } = useSignup();
  const router = useRouter();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const result = await handleSubmit(event);
    if (result.error) {
      toastError(result.error);
    } else if (result.success) {
      toastSuccess(result.success);
      router.push('/auth/login');
    }
  };

  return (
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}>
      <form onSubmit={handleFormSubmit}>
        <Stack spacing={4}>
          <UsernameField
            id="username"
            label="Username"
            type="text"
            name="username"
            error={error.username}
            loading={signupLoading}
          />
          <PasswordField
            id="password"
            label="Password"
            name="password"
            error={error.password}
            loading={signupLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            error={error.confirmPassword}
            loading={signupLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Stack spacing={10}>
            <Button
              type="submit"
              bg={'blue.400'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              isLoading={signupLoading}
              spinner={<Spinner />}>
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
