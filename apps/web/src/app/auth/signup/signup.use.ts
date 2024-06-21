import { useState, useEffect } from 'react';
import { validateSignupForm } from './validation';
import { CreateUserDto } from '@dto/user/dto/create-user.dto';
import { signupAction } from './signup.service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@web/app/auth/AuthContext';
import { ActionErrorResponse } from '@web/app/common/action-error-reponse.interface';
import { HttpStatus } from '@web/app/common/http-status.enum';
import { FormSubmitResult } from '@web/app/common/form-submit-result.interface';

interface UseSignupResult {
  error: CreateUserDto;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<FormSubmitResult>;
  signupLoading: boolean;
}

export const useSignup = (): UseSignupResult => {
  const [error, setError] = useState<CreateUserDto>({ username: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSignupError = (signupError: ActionErrorResponse): FormSubmitResult => {
    const formErrorCode = [HttpStatus.CONFLICT];
    if (formErrorCode.includes(signupError.status)) {
      setError({ username: signupError.message, password: '', confirmPassword: '' });
      return {};
    }
    return { error: signupError.message };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<FormSubmitResult> => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get('username')!.toString().trim();
    const password = formData.get('password')!.toString().trim();
    const confirmPassword = formData.get('confirmPassword')!.toString().trim();
    const createUserDto: CreateUserDto = { username, password, confirmPassword };

    const validationErrors = validateSignupForm(createUserDto);
    if (validationErrors.username || validationErrors.password || validationErrors.confirmPassword) {
      setError(validationErrors);
      return {};
    }

    setSignupLoading(true);
    const signupError = await signupAction(createUserDto);
    setSignupLoading(false);

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
    signupLoading,
  };
};
