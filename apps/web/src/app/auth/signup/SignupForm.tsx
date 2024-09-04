import React from 'react';
import { Paper, Stack, Button, Text, Anchor, TextInput, PasswordInput } from '@mantine/core';
import { UseSignup, useSignup as defaultUseSignup } from './signup.hook';
import { useDisclosure } from '@mantine/hooks';
import { showSuccessNotification, showErrorNotification } from '@web/common/helpers/notifications.helpers';
import { useRouter } from 'next/navigation';

export interface SignupFormProps {
  useSignup?: () => UseSignup;
}

export const SignupForm: React.FC<SignupFormProps> = ({ useSignup = defaultUseSignup }) => {
  const { error, handleSubmit, signupPending } = useSignup();
  const router = useRouter();

  const [passwordVisible, { toggle: togglePassword }] = useDisclosure(false);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    <Paper
      shadow="md"
      p="lg"
      radius="md"
      withBorder>
      <form
        onSubmit={handleFormSubmit}
        aria-label="Sign up form">
        <Stack gap="x">
          <TextInput
            id="username"
            label="Username"
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
          <Button
            type="submit"
            fullWidth
            loading={signupPending}
            loaderProps={{ type: 'dots' }}>
            Sign up
          </Button>
          <Text
            ta="center"
            size="sm">
            Already a user?{' '}
            <Anchor
              href="/auth/login"
              size="sm">
              Login
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
};
