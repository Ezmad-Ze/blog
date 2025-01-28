import { Router } from 'express';
import { getAllBlogs, getBlogById, updateBlog, deleteBlog, createBlog, searchBlogs } from '../controllers/blog.controller';
import {authMiddleware} from '../middleware/auth.middleware';

 const blogRouter = Router();

blogRouter.get('/', getAllBlogs);
blogRouter.get("/search", searchBlogs)

blogRouter.post('/', authMiddleware, createBlog);
blogRouter.get('/:id', getBlogById);


blogRouter.put('/:id', authMiddleware, updateBlog);
blogRouter.delete('/:id', authMiddleware, deleteBlog);

export default blogRouter