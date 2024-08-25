import { useState, useEffect } from 'react';
import { validateLoginForm } from './validation';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { ActionErrorResponse } from '@web/app/common/action-response.type';
import { useAuth as defaultUseAuth, AuthContextInterface } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginUserDto } from '@dto/user/dto/log-in-user.dto';
import { FormSubmitResult } from '@web/app/common/form-submit-result.interface';
import { DtoValidationError } from '@web/app/common/dto-validation-error.type';

export interface UseLogin {
  error: DtoValidationError<LoginUserDto>;
  authLoading: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<FormSubmitResult>;
}

export interface UseLoginDependencies {
  useAuth?: () => AuthContextInterface;
}

export const useLogin = ({ useAuth = defaultUseAuth }: UseLoginDependencies = {}): UseLogin => {
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState<DtoValidationError<LoginUserDto>>({ username: [], password: [] });
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLoginError = (loginError: ActionErrorResponse<LoginUserDto>): FormSubmitResult => {
    const formError = [HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED];
    if (formError.includes(loginError.status)) {
      setError(loginError.details || {});
      return {};
    }
    return { error: loginError.message };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<FormSubmitResult> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginDto: LoginUserDto = {
      username: (formData.get('username') as string).trim(),
      password: (formData.get('password') as string).trim(),
    };

    const validationErrors = validateLoginForm(loginDto);
    if (validationErrors) {
      setError(validationErrors);
      return {};
    }

    const { error: loginError } = await login(loginDto);

    if (loginError) {
      return handleLoginError(loginError);
    }

    return { success: 'Login successful' };
  };

  return {
    error,
    handleSubmit,
    authLoading,
  };
};
