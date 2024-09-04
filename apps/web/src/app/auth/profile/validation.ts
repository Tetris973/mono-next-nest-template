import { z } from 'zod';
import { usernameSchema } from '@web/common/validations/validation';

export const profileFormSchema = z.object({
  username: usernameSchema,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
