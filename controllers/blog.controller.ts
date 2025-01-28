import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const { title, content } = req.body;

        if (!title || !content) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }

        const newBlog = await prisma.blog.create({
            data: {
                title,
                content,
                userId,
            },
        });
        res.json(newBlog);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create blog' });
        return
    }
}

export const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogs = await prisma.blog.findMany({
            include: {
                user: true,
                comments: true,
                ratings: true,
                likes: true,
            },
        });
        res.json(blogs);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
        return
    }
}

export const getBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
            include: {
                user: true,
                comments: true,
                ratings: true,
                likes: true,
            },
        });
        if (!blog) {
            res.status(404).json({ error: 'Blog not found' });
            return
        }
        res.json(blog);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
        return
    }
}

export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        const { title, content } = req.body;

        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
        });
        if (!blog) {
            res.status(404).json({ error: 'Blog not found' });
            return
        }
        if (blog.userId !== userId) {
            res.status(403).json({ error: 'Not authorized to update this blog' });
            return
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: Number(id) },
            data: { title, content },
        });

        res.json(updatedBlog);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update blog' });
        return
    }
}

export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
        });
        if (!blog) {
            res.status(404).json({ error: 'Blog not found' });
            return
        }
        if (blog.userId !== userId) {
            res.status(403).json({ error: 'Not authorized to delete this blog' });
            return
        }

        await prisma.blog.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Blog deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete blog' });
        return
    }
}


export const searchBlogs = async (req: Request, res: Response) : Promise<void> => {
    try {
      const { query } = req.query; 
      const blogs = await prisma.blog.findMany({
        where: {
          OR: [
            { title: { contains: query as string, mode: 'insensitive' } },
            { content: { contains: query as string, mode: 'insensitive' } }
          ]
        }
      });
       res.json(blogs);
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ error: 'Search failed' });
       return
    }
  }
  