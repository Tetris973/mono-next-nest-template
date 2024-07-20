import { Box, Button, Stack, Text, Tooltip, useColorModeValue, Spinner, Checkbox, Link } from '@chakra-ui/react';
import { UseLogin, useLogin as defaultUseLogin } from './login.use';
import { UsernameField } from '@web/app/components/UsernameField';
import { PasswordField } from '@web/app/components/PasswordField';
import { useCustomToast } from '@web/app/utils/toast-utils.use';

export interface LoginFormProps {
  useLogin?: () => UseLogin;
}

export const LoginForm: React.FC<LoginFormProps> = ({ useLogin = defaultUseLogin }) => {
  const { toastError } = useCustomToast();
  const { error, showPassword, setShowPassword, handleSubmit, authLoading } = useLogin();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const result = await handleSubmit(event);
    if (result.error) {
      toastError(result.error);
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
        aria-label="Login form">
        <Stack spacing={4}>
          <UsernameField
            id="username"
            label="Username"
            type="text"
            name="username"
            error={error.username}
            loading={authLoading}
          />
          <PasswordField
            id="password"
            label="Password"
            name="password"
            error={error.password}
            loading={authLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <Stack spacing={10}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <Tooltip
                label="Not available yet"
                shouldWrapChildren
                mt="3">
                <Text
                  as="span"
                  color="gray.500">
                  <Checkbox isDisabled>Remember me</Checkbox>
                </Text>
              </Tooltip>
              <Tooltip
                label="Not available yet"
                shouldWrapChildren
                mt="3">
                <Text
                  as="span"
                  color="gray.500"
                  cursor="not-allowed">
                  Forgot password?
                </Text>
              </Tooltip>
            </Stack>
            <Button
              aria-label="Sign in"
              type="submit"
              bg={'blue.400'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              isLoading={authLoading}
              isDisabled={authLoading}
              spinner={<Spinner />}>
              Sign in
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
              Not a user yet?{' '}
              <Link
                href="/auth/signup"
                color={'blue.400'}>
                Sign up
              </Link>
            </Text>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
