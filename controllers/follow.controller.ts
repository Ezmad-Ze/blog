import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const followerId = (req as any).userId;
    const followingId = Number(req.params.id); 

    if (!followingId) {
      res.status(400).json({ error: 'Invalid user ID to follow.' });
      return;
    }

    if (followerId === followingId) {
      res.status(400).json({ error: "You can't follow yourself." });
      return;
    }

    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!userToFollow) {
      res.status(404).json({ error: 'User to follow not found.' });
      return;
    }

    const existingFollow = await prisma.follow.findFirst({
      where: { followerId, followingId },
    });
    if (existingFollow) {
      res.status(400).json({ error: 'You are already following this user.' });
      return;
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.json({ message: 'Followed user successfully.' });
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to follow user.' });
    return
  }
};


export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const followerId = (req as any).userId;
      const followingId = Number(req.params.id);
  
      if (!followingId) {
        res.status(400).json({ error: 'Invalid user ID to unfollow.' });
        return;
      }
  
      const userToUnfollow = await prisma.user.findUnique({
        where: { id: followingId },
      });
      if (!userToUnfollow) {
        res.status(404).json({ error: 'User to unfollow not found.' });
        return;
      }
  
      const existingFollow = await prisma.follow.findFirst({
        where: { followerId, followingId },
      });
      if (!existingFollow) {
        res.status(400).json({ error: 'You are not following this user.' });
        return;
      }
  
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
  
      res.json({ message: 'Unfollowed user successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to unfollow user.' });
    }
  };
  