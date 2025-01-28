import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const { blogId, content } = req.body;

        if (!blogId || !content) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                userId,
                blogId,
            },
        });
        res.json(newComment);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create comment' });
        return
    }
}

export const editComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
        });
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return
        }
        if (comment.userId !== userId) {
            res.status(403).json({ error: 'Not authorized to edit this comment' });
            return
        }


        const updatedComment = await prisma.comment.update({
            where: { id: Number(id) },
            data: { content },
        });

        res.json(updatedComment);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to edit comment' });
        return
    }
}

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
        });
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return
        }
        if (comment.userId !== userId) {
            res.status(403).json({ error: 'Not authorized to delete this comment' });
            return
        }

        await prisma.comment.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Comment deleted successfully' });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete comment' });
        return
    }
}
