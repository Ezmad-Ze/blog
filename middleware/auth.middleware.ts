import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) : Promise<void> => { 
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Missing authorization header' });
    return
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
     res.status(401).json({ error: 'Invalid authorization header format' });
     return
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    (req as any).userId = decoded.userId; 
    next();
  } catch (error) {
     res.status(401).json({ error: 'Invalid token' });
     return
  }
};
