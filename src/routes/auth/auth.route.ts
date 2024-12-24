import { Router } from 'express';
import {
  loginController,
  signUpController,
} from '../../controllers/auth/auth.controller';

const authRouter = Router();

authRouter.post('/signup', signUpController);

authRouter.post('/signin', loginController);

export default authRouter;
