import { Router } from 'express';
import tasksRouter from './tasks.js';
import authRouter from './auth.js';
import userRouter from './users.js';
import adminRouter from './admin.js';

const router = Router();

router.use('/tasks', tasksRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/admin', adminRouter);

export default router;