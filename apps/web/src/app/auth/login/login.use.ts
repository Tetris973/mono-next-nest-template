import { useState, useEffect } from 'react';
import { validateLoginForm } from './validation';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { ServerActionResponseErrorDto } from '@web/common/types/action-response.type';
import { useAuth as defaultUseAuth, AuthContextInterface } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginUserDto } from '@dto/modules/user/dto/log-in-user.dto';
import { FormSubmitResult } from '@web/common/interfaces/form-submit-result.interface';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

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

  const handleLoginError = (loginError: ServerActionResponseErrorDto<LoginUserDto>): FormSubmitResult => {
    const formError = [HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED];
    if (formError.includes(loginError.error.status)) {
      setError(loginError.data || {});
      return {};
    }
    return { error: loginError.error.message };
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

    const loginError = await login(loginDto);

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
