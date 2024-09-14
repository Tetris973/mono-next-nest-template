import React from 'react';
import { Paper, Stack, Button, Text, Anchor, TextInput, PasswordInput } from '@mantine/core';
import { UseSignup, useSignup as defaultUseSignup } from './signup.hook';
import { useDisclosure } from '@mantine/hooks';
import { showSuccessNotification, showErrorNotification } from '@web/common/helpers/notifications.helpers';
import { useRouter } from 'next/navigation';
import { CreateUserDto } from '@web/lib/backend-api/index';

export interface SignupFormProps {
  useSignup?: () => UseSignup;
}

export const SignupForm: React.FC<SignupFormProps> = ({ useSignup = defaultUseSignup }) => {
  const { form, handleSubmit, signupPending } = useSignup();
  const router = useRouter();

  const [passwordVisible, { toggle: togglePassword }] = useDisclosure(false);

  const handleFormSubmit = async (createUserDto: CreateUserDto) => {
    handleSubmit(createUserDto).then((result) => {
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
    });
  };

  return (
    <Paper
      shadow="md"
      p="lg"
      radius="md"
      withBorder>
      <form
        onSubmit={form.onSubmit((values: CreateUserDto) => handleFormSubmit(values))}
        aria-label="Sign up form">
        <Stack gap="x">
          <TextInput
            label="Username"
            key={form.key('username')}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Password"
            key={form.key('password')}
            {...form.getInputProps('password')}
            visible={passwordVisible}
            onVisibilityChange={togglePassword}
          />
          <PasswordInput
            label="Confirm Password"
            key={form.key('confirmPassword')}
            {...form.getInputProps('confirmPassword')}
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
