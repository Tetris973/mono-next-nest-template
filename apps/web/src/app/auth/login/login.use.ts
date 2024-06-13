// app/auth/login/login.use

import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { validateLoginForm } from './validation';
import { HttpStatus } from '@web/app/constants/http-status';
import { LoginFormError } from '@web/app/common/form-error.interface';
import { useAuth } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const toastServerError = (message: string) => {
    toast.closeAll();
    toast({
      title: 'Server Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleLoginError = (loginError: LoginFormError) => {
    switch (loginError.code) {
      case HttpStatus.SERVICE_UNAVAILABLE:
        toast.closeAll();
        toastServerError(loginError.message);
        break;
      case HttpStatus.NOT_FOUND:
        setError((prev) => ({ ...prev, username: 'User not found' }));
        break;
      case HttpStatus.UNAUTHORIZED:
        setError((prev) => ({ ...prev, password: 'Incorrect password' }));
        break;
      default:
        toast.closeAll();
        toastServerError(loginError.message);
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const username = formData.get('username')?.toString().trim();
    const password = formData.get('password')?.toString().trim();

    const validationErrors = validateLoginForm(username!, password!);
    setError(validationErrors);

    if (validationErrors.username || validationErrors.password) {
      return;
    }

    const loginError = await login(formData);

    if (loginError) {
      handleLoginError(loginError);
    }
  };

  return {
    error,
    showPassword,
    setShowPassword,
    handleSubmit,
    authLoading,
  };
};
