import { Router } from 'express';
import authRouter from './auth.js';
import usersRouter from './users.js';
import boardsRouter from './boards.js';
import helpRouter from './help.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/boards', boardsRouter);
router.use('/help', helpRouter);

export default router;
