import { useState, useEffect } from 'react';
import { validateLoginForm } from './validation';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { ActionErrorResponse } from '@web/app/common/action-response.type';
import { useAuth as defaultUseAuth, AuthContextInterface } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';
import { FormSubmitResult } from '@web/app/common/form-submit-result.interface';

export interface UseLogin {
  error: LoginUserDto;
  showPassword: boolean;
  authLoading: boolean;
  setShowPassword: (showPassword: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<FormSubmitResult>;
}

export interface UseLoginDependencies {
  useAuth?: () => AuthContextInterface;
}

export const useLogin = ({ useAuth = defaultUseAuth }: UseLoginDependencies = {}): UseLogin => {
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState<LoginUserDto>({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLoginError = (loginError: ActionErrorResponse): FormSubmitResult => {
    switch (loginError.status) {
      case HttpStatus.SERVICE_UNAVAILABLE:
        return { error: loginError.message };
      case HttpStatus.NOT_FOUND:
        setError((prev) => ({ ...prev, username: loginError.message }));
        return {};
      case HttpStatus.UNAUTHORIZED:
        setError((prev) => ({ ...prev, password: loginError.message }));
        return {};
      default:
        return {};
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<FormSubmitResult> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginDto: LoginUserDto = {
      username: (formData.get('username') as string).trim(),
      password: (formData.get('password') as string).trim(),
    };

    const validationErrors = validateLoginForm(loginDto);
    setError(validationErrors);

    if (validationErrors.username || validationErrors.password) {
      return {};
    }

    const { error: loginError } = await login(loginDto);

    if (loginError) {
      return handleLoginError(loginError);
    }

    return {};
  };

  return {
    error,
    showPassword,
    setShowPassword,
    handleSubmit,
    authLoading,
  };
};
