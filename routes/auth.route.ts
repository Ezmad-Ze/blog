import { Router } from 'express';
import { register, login, changeRole } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/change-role', authMiddleware, changeRole);

export default authRouter