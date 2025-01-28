import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.middleware';
import { createComment, deleteComment, editComment } from '../controllers/comment.controller';
import { rateBlog, toggleLikes } from '../controllers/rating.controller';

const commentRouter = Router();

commentRouter.post('/', authMiddleware, createComment);
commentRouter.post("/like", authMiddleware, toggleLikes)

commentRouter.post("/rate", authMiddleware, rateBlog)

commentRouter.put("/:id", authMiddleware, editComment)
commentRouter.delete('/:id', authMiddleware, deleteComment);



export default commentRouter