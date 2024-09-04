import { z } from 'zod';
import { usernameSchema, passwordSchema } from '@web/common/validations/validation';

export const loginFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
