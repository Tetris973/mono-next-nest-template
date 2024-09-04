import { useState, useEffect } from 'react';
import { validateSignupForm } from './validation';
import { CreateUserDto } from '@dto/modules/user/dto/create-user.dto';
import { signupAction as defaultSignupAction } from './signup.service';
import { useRouter } from 'next/navigation';
import { AuthContextInterface, useAuth as defaultUseAuth } from '@web/app/auth/AuthContext';
import { ServerActionResponseErrorDto } from '@web/common/types/action-response.type';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { FormSubmitResult } from '@web/common/interfaces/form-submit-result.interface';
import { useServerAction } from '@web/common/helpers/server-action.use';
import { DtoValidationError } from '@web/common/types/dto-validation-error.type';

export interface UseSignup {
  error: DtoValidationError<CreateUserDto>;
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
  const [signupPending, signupActionM] = useServerAction(signupAction);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSignupError = (signupError: ServerActionResponseErrorDto<CreateUserDto>): FormSubmitResult => {
    if (signupError.error.status === HttpStatus.CONFLICT || signupError.error.status === HttpStatus.BAD_REQUEST) {
      setError(signupError.data || {});
      return {};
    }
    return { error: signupError.error.message };
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

    const signupRes = await signupActionM(createUserDto);
    if (signupRes.error) {
      return handleSignupError(signupRes);
    }

    return { success: 'Signup successful' };
  };

  return {
    error,
    handleSubmit,
    signupPending,
  };
};
