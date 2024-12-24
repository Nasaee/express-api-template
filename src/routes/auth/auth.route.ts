import { Router } from 'express';
import {
  loginController,
  signUpController,
} from '../../controllers/auth/auth.controller';
import { errorHandler } from '../../middlewares/errors.middleware';

const authRouter = Router();

authRouter.post('/signup', errorHandler(signUpController));

authRouter.post('/signin', errorHandler(loginController));

export default authRouter;
