import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '../constants/constants';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
});

export { signInSchema };
