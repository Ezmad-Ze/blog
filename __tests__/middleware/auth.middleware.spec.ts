import request from 'supertest';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../middleware/auth.middleware'; // Adjust your import path

describe('authMiddleware', () => {
  let app: express.Express;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
    app = express();
    app.get('/test', authMiddleware, (req: Request, res: Response) => {
      const userId = (req as any).userId;
      res.json({ message: 'Protected route', userId });
    });
  });

  it('should return 401 if no authorization header is present', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Missing authorization header');
  });

  it('should return 401 if token is missing after Bearer', async () => {
    const res = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer ');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid authorization header format');
  });

  it('should return 401 for an invalid token', async () => {
    const res = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid token');
  });

  it('should set userId on req and call next() for a valid token', async () => {
    const token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET as string);

    const res = await request(app)
      .get('/test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Protected route');
    expect(res.body.userId).toBe(123);
  });
});
