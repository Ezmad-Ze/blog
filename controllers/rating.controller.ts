import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const { blogId, ratingValue } = req.body;

        if (!blogId || !ratingValue) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }

        if (ratingValue < 1 || ratingValue > 5) {
            res.status(400).json({ error: 'Rating must be between 1 and 5' });
            return
        }

        const existingRating = await prisma.blogRating.findFirst({
            where: { userId, blogId },
        });

        if (existingRating) {
            const updatedRating = await prisma.blogRating.update({
                where: { id: existingRating.id },
                data: { ratingValue },
            });
            res.json(updatedRating);
            return
        } else {
            const newRating = await prisma.blogRating.create({
                data: {
                    userId,
                    blogId,
                    ratingValue,
                },
            });
            res.json(newRating);
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to rate blog' });
        return
    }
}


export const toggleLikes = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const { blogId } = req.body;

        if (!blogId) {
            res.status(400).json({ error: 'Missing blogId' });
            return;
        }

        const existingLike = await prisma.like.findFirst({
            where: { userId, blogId },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id },
            });
            res.json({ message: 'Blog unliked' });
        } else {
            const newLike = await prisma.like.create({
                data: {
                    userId,
                    blogId,
                },
            });
            res.json(newLike);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
}