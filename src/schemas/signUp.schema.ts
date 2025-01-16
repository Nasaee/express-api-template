import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../configs/constants';

const signUpSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(30),
});

export { signUpSchema };
