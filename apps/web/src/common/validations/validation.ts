import { z } from 'zod';

export const usernameSchema = z.string().min(6, 'Username must be at least 6 characters.');

export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
    'Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character.',
  );
