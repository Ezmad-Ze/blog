import { NextFunction, Request, RequestHandler, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { comparePassword, generateToken, hashPassword } from '../utils/utils';
import { ROLES } from '../enum';

const prisma = new PrismaClient();


export const register  = async (req: Request, res: Response)  : Promise<void> => {
  try {
    const { username, email, password, confirm_password, name, bio } = req.body;

    if (!username || !email || !password || !confirm_password || !name) {
       res.status(400).json({ error: 'Missing required fields' });
       return
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
       res
        .status(400)
        .json({ error: 'Username or email already exists.' });
        return 
    }

    if (password !== confirm_password) {
       res.status(400).json({ error: 'Passwords do not match.' });
       return
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        bio,
      },
    });

   res.json({ success: true, user });
  } catch (error) {
    console.error(error);
     res.status(500).json({ error: 'Registration failed' });
  }
}

export const login  = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
       res.status(401).json({ error: 'Invalid credentials' });
       return
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
       res.status(401).json({ error: 'Invalid credentials' });
       return
    }

    const token = generateToken(user.id);

     res.json({ success: true, token });
  } catch (error) {
    console.error(error);
     res.status(500).json({ error: 'Login failed' });
  }
}

export const changeRole = async (req: Request, res: Response): Promise<void> => {
  try {

    const userId = (req as any).userId;
    
    const { targetUserId, role } = req.body;

    
    const currentUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });


    if (!currentUser) {
      res.status(404).json({ error: 'Current user not found.' });
      return;
    }

    if (currentUser.role !== ROLES.ADMIN) {
      res.status(403).json({ error: 'You are not authorized to change roles.' });
      return;
    }

    if (!targetUserId || !role) {
      res.status(400).json({ error: 'Missing required fields.' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(targetUserId) },
      data: { role : Number(role) },
    });

    res.json(updatedUser);
    return
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to change role' });
    return
  }
}

