import { Router } from 'express';
import { getProfile, searchUsers, updateProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const userRouter = Router();


userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.get('/search', searchUsers)

userRouter.get('/:id', getProfile);


export default userRouter