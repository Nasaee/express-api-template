import { Router } from 'express';
import {
  loginController,
  logoutController,
  signUpController,
} from '../../controllers/auth/auth.controller';
import { errorHandler } from '../../middlewares/errors.middleware';

const authRouter = Router();

authRouter.post('/signup', errorHandler(signUpController));

authRouter.post('/signin', errorHandler(loginController));

authRouter.post('/signout', errorHandler(logoutController));

export default authRouter;
