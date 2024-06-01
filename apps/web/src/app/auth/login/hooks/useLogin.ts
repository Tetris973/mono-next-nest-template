// app/auth/login/hooks/useLogin.ts

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { validateLoginForm } from '../validation';
import { login } from '../login';
import { HttpStatus } from '@web/app/constants/http-status';
import { LoginFormError } from '@web/app/common/form-error.interface';

export const useLogin = () => {
  const [error, setError] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLoginError = (loginError: LoginFormError) => {
    switch (loginError.code) {
      case HttpStatus.SERVICE_UNAVAILABLE:
        toast.closeAll();
        toast({
          title: 'Server Error',
          description: loginError.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        break;
      case HttpStatus.NOT_FOUND:
        setError((prev) => ({ ...prev, username: 'User not found' }));
        break;
      case HttpStatus.UNAUTHORIZED:
        setError((prev) => ({ ...prev, password: 'Incorrect password' }));
        break;
      default:
        toast.closeAll();
        toast({
          title: 'Server Error',
          description: loginError.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const username = formData.get('username')?.toString().trim();
    const password = formData.get('password')?.toString().trim();

    const validationErrors = validateLoginForm(username!, password!);
    setError(validationErrors);

    if (validationErrors.username || validationErrors.password) {
      setLoading(false);
      return;
    }

    const loginError = await login(formData);

    if (loginError) {
      handleLoginError(loginError);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return {
    error,
    showPassword,
    setShowPassword,
    handleSubmit,
    loading,
  };
};
