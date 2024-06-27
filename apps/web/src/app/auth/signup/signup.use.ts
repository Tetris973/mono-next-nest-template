import { useState, useEffect } from 'react';
import { validateSignupForm } from './validation';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';
import { signupAction as defaultSignupAction } from './signup.service';
import { useRouter } from 'next/navigation';
import { AuthContextInterface, useAuth as defaultUseAuth } from '@web/app/auth/AuthContext';
import { ActionErrorResponse } from '@web/app/common/action-response.type';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { FormSubmitResult } from '@web/app/common/form-submit-result.interface';
import { useServerAction } from '@web/app/utils/server-action.use';
import { DtoValidationError } from '@web/app/common/dto-validation-error.type';

export interface UseSignup {
  error: DtoValidationError<CreateUserDto>;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<FormSubmitResult>;
  signupPending: boolean;
}

export interface UseSignupDependencies {
  useAuth?: () => AuthContextInterface;
  signupAction?: typeof defaultSignupAction;
}

export const useSignup = ({
  useAuth = defaultUseAuth,
  signupAction = defaultSignupAction,
}: UseSignupDependencies = {}): UseSignup => {
  const [error, setError] = useState<DtoValidationError<CreateUserDto>>({
    username: [],
    password: [],
    confirmPassword: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signupPending, signupActionM] = useServerAction(signupAction);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSignupError = (signupError: ActionErrorResponse<CreateUserDto>): FormSubmitResult => {
    if (signupError.status === HttpStatus.CONFLICT || signupError.status === HttpStatus.BAD_REQUEST) {
      setError(signupError.details || {});
      return {};
    }
    return { error: signupError.message };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<FormSubmitResult> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const createUserDto: CreateUserDto = {
      username: (formData.get('username') as string).trim(),
      password: (formData.get('password') as string).trim(),
      confirmPassword: (formData.get('confirmPassword') as string).trim(),
    };

    const validationErrors = validateSignupForm(createUserDto);
    if (validationErrors) {
      setError(validationErrors);
      return {};
    }

    const { error: signupError } = await signupActionM(createUserDto);
    if (signupError) {
      return handleSignupError(signupError);
    }

    return { success: 'Signup successful' };
  };

  return {
    error,
    showPassword,
    setShowPassword,
    handleSubmit,
    signupPending,
  };
};
