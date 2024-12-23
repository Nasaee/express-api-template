import { Router } from 'express';
import authRouter from './auth/auth.route';

const rootRouter = Router();

rootRouter.get('/', (req, res) => {
  res.send('Hello World');
});

//* Auth
rootRouter.use('/auth', authRouter);

export default rootRouter;
