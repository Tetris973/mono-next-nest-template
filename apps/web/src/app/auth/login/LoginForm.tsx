import { Box, Button, Stack, Text, Tooltip, useColorModeValue, Spinner, Checkbox, Link } from '@chakra-ui/react';
import { UseLogin, useLogin as defaultUseLogin } from './login.use';
import { PasswordInput, TextInput } from '@mantine/core';
import { showErrorNotification } from '@web/app/utils/notifications';

export interface LoginFormProps {
  useLogin?: () => UseLogin;
}

export const LoginForm: React.FC<LoginFormProps> = ({ useLogin = defaultUseLogin }) => {
  const { error, handleSubmit, authLoading } = useLogin();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const result = await handleSubmit(event);
    if (result.error) {
      showErrorNotification({
        message: result.error,
      });
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
            autoComplete="current-password"
            error={Array.isArray(error.password) ? error.password.join(', ') : error.password}
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
