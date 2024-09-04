import { useEffect } from 'react';
import { loginFormSchema, LoginFormValues } from './validation';
import { zodResolver } from 'mantine-form-zod-resolver';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { ServerActionResponseErrorDto } from '@web/common/types/server-action-response.type';
import { useAuth as defaultUseAuth, AuthContextInterface } from '@web/app/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginUserDto } from '@web/common/dto/backend-index.dto';
import { FormSubmitResult } from '@web/common/interfaces/form-submit-result.interface';
import { useForm, UseFormReturnType } from '@mantine/form';

export interface UseLogin {
  form: UseFormReturnType<LoginUserDto>;
  authLoading: boolean;
  handleSubmit: (loginDto: LoginUserDto) => Promise<FormSubmitResult>;
}

export interface UseLoginDependencies {
  useAuth?: () => AuthContextInterface;
}

export const useLogin = ({ useAuth = defaultUseAuth }: UseLoginDependencies = {}): UseLogin => {
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(loginFormSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLoginError = (loginError: ServerActionResponseErrorDto<LoginUserDto>): FormSubmitResult => {
    const formError = [HttpStatus.BAD_REQUEST, HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED];
    if (formError.includes(loginError.error.status)) {
      form.setErrors(loginError.data || {});
      return {};
    }
    return { error: loginError.error.message };
  };

  const handleSubmit = async (loginDto: LoginUserDto): Promise<FormSubmitResult> => {
    const loginError = await login(loginDto);

    if (loginError) {
      return handleLoginError(loginError);
    }

    return { success: 'Login successful' };
  };

  return {
    form,
    handleSubmit,
    authLoading,
  };
};
