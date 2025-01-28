import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function hashPassword(password: string) {
    const hash = await bcrypt.hashSync(password, 10);
    return hash;
}

export async function comparePassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

export function generateToken(userId: number) {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
  return token;
}

