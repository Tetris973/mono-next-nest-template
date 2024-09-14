import { useEffect } from 'react';
import { signupFormSchema, SignupFormValues } from './validation';
import { zodResolver } from 'mantine-form-zod-resolver';
import { CreateUserDto } from '@web/lib/backend-api/index';
import { signupAction as defaultSignupAction } from './signup.service';
import { useRouter } from 'next/navigation';
import { AuthContextInterface, useAuth as defaultUseAuth } from '@web/app/auth/AuthContext';
import { ServerActionResponseErrorDto } from '@web/common/types/server-action-response.type';
import { HttpStatus } from '@web/common/enums/http-status.enum';
import { FormSubmitResult } from '@web/common/interfaces/form-submit-result.interface';
import { useServerAction } from '@web/common/helpers/server-action.hook';
import { useForm, UseFormReturnType } from '@mantine/form';

export interface UseSignup {
  form: UseFormReturnType<CreateUserDto>;
  handleSubmit: (createUserDto: CreateUserDto) => Promise<FormSubmitResult>;
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
  const [signupPending, signupActionM] = useServerAction(signupAction);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const form = useForm<SignupFormValues>({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: zodResolver(signupFormSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSignupError = (signupError: ServerActionResponseErrorDto<CreateUserDto>): FormSubmitResult => {
    if (signupError.error.status === HttpStatus.CONFLICT || signupError.error.status === HttpStatus.BAD_REQUEST) {
      form.setErrors(signupError.data || {});
      return {};
    }
    return { error: signupError.error.message };
  };

  const handleSubmit = async (createUserDto: CreateUserDto): Promise<FormSubmitResult> => {
    const signupRes = await signupActionM(createUserDto);
    if (signupRes.error) {
      return handleSignupError(signupRes);
    }

    return { success: 'Signup successful' };
  };

  return {
    form,
    handleSubmit,
    signupPending,
  };
};
