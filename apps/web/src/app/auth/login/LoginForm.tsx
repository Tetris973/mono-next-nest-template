import React from 'react';
import { Paper, Stack, Button, Text, Tooltip, Checkbox, Anchor, Group, TextInput, PasswordInput } from '@mantine/core';
import { UseLogin, useLogin as defaultUseLogin } from './login.hook';
import { showErrorNotification } from '@web/common/helpers/notifications.helpers';
import { LoginUserDto } from '@web/lib/backend-api/index';

export interface LoginFormProps {
  useLogin?: () => UseLogin;
}

export const LoginForm: React.FC<LoginFormProps> = ({ useLogin = defaultUseLogin }) => {
  const { form, handleSubmit, authLoading } = useLogin();

  const handleFormSubmit = async (loginDto: LoginUserDto) => {
    handleSubmit(loginDto).then(({ error }) => {
      if (error) {
        showErrorNotification({
          message: error,
        });
      }
    });
  };

  return (
    <Paper
      shadow="md"
      p="lg"
      radius="md"
      withBorder>
      <form
        onSubmit={form.onSubmit((values: LoginUserDto) => handleFormSubmit(values))}
        aria-label="Login form">
        <Stack gap="md">
          <TextInput
            label="Username"
            key={form.key('username')}
            autoComplete="username"
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Password"
            key={form.key('password')}
            type="password"
            autoComplete="current-password"
            {...form.getInputProps('password')}
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
