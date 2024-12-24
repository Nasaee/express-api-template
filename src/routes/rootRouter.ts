import { Router } from 'express';
import authRouter from './auth/auth.route';

const rootRouter = Router();

//* Auth
rootRouter.use('/auth', authRouter);

export default rootRouter;
