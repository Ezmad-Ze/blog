import { Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getProfile = async (req: Request, res: Response) : Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
          res.status(400).json({ error: 'Missing required fields' });
          return
        }

        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            bio: true,
          },
        });
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return
        }
         res.json(user);
         return
      } catch (error) {
        console.error(error);
         res.status(500).json({ error: 'Something went wrong' });
         return
      }

}

export const updateProfile  = async (req: Request, res: Response) :Promise<void> => {
    try {
      // userId from JWT
      const userId = (req as any).userId;
      const { name, bio } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, bio },
      });

       res.json(updatedUser);
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ error: 'Failed to update profile' });
       return
    }
  }

  export const searchUsers  = async (req: Request, res: Response) : Promise<void> => {
    try {
      const { query } = req.query;
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query as string } },
            { email: { contains: query as string } },
            { name: { contains: query as string } },
          ],
        },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          bio: true,
        },
      });
       res.json(users);
       return
    } catch (error) {
      console.error(error);
       res.status(500).json({ error: 'Search failed' });
       return
    }
  }