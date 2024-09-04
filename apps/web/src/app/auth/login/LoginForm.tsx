import React from 'react';
import { Paper, Stack, Button, Text, Tooltip, Checkbox, Anchor, Group, TextInput, PasswordInput } from '@mantine/core';
import { UseLogin, useLogin as defaultUseLogin } from './login.hook';
import { showErrorNotification } from '@web/common/helpers/notifications.helpers';

export interface LoginFormProps {
  useLogin?: () => UseLogin;
}

export const LoginForm: React.FC<LoginFormProps> = ({ useLogin = defaultUseLogin }) => {
  const { error, handleSubmit, authLoading } = useLogin();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await handleSubmit(event);
    if (result.error) {
      showErrorNotification({
        message: result.error,
      });
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
        aria-label="Login form">
        <Stack gap="md">
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
          <Group
            justify="space-between"
            mt="xs">
            <Tooltip
              label="Not available yet"
              withArrow>
              <Checkbox
                label="Remember me"
                disabled
              />
            </Tooltip>
            <Tooltip
              label="Not available yet"
              withArrow>
              <Anchor
                component="button"
                size="sm"
                c="dimmed"
                style={{ cursor: 'not-allowed' }}>
                Forgot password?
              </Anchor>
            </Tooltip>
          </Group>
          <Button
            aria-label="Sign in"
            type="submit"
            fullWidth
            loading={authLoading}
            loaderProps={{ type: 'dots' }}>
            Sign in
          </Button>
          <Text
            ta="center"
            size="sm">
            Not a user yet?{' '}
            <Anchor
              href="/auth/signup"
              size="sm">
              Sign up
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
};
