import { Router } from 'express';
import authRouter from './auth/auth.route';
import { authMiddleware } from '../middlewares/auth.middleware';

const rootRouter = Router();

//* Auth
rootRouter.use('/auth', authRouter);

rootRouter.use('/somePath', authMiddleware, (req, res) => {});

export default rootRouter;
