import { Box, Button, Stack, Text, Tooltip, useColorModeValue, Spinner, Checkbox } from '@chakra-ui/react';
import { useLogin } from './login.use';
import { LoginField } from './LoginField';
import { PasswordField } from './PasswordField';

export const LoginForm: React.FC = () => {
  const { error, showPassword, setShowPassword, handleSubmit, authLoading } = useLogin();

  return (
    <Box
      rounded={'lg'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      p={8}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <LoginField
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
              type="submit"
              bg={'blue.400'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}
              isLoading={authLoading}
              spinner={<Spinner />}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
