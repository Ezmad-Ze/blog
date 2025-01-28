import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { hashPassword, generateToken, comparePassword } from '../../utils/utils';

describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
        const password = 'mysecretpassword';
        const hash = await hashPassword(password);

        expect(hash).toBeDefined();
        expect(hash).not.toBe(password);
        expect(hash.length).toBeGreaterThan(0);

        const isMatch = await bcrypt.compare(password, hash);
        expect(isMatch).toBe(true);
    });
});

describe('generateToken', () => {

    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret';
    });

    it('should generate a token', () => {

        const userId = 1;
        const token = generateToken(userId);
        const decoded = jwt.decode(token) as jwt.JwtPayload | null;

        expect(decoded).toBeDefined();
        expect(decoded).not.toBeNull();
        if (decoded) {
            expect(decoded.userId).toBe(userId);
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        expect(verified.userId).toBe(userId);

        expect(verified.exp).toBeDefined();
        if (verified.exp && verified.iat) {
            const ttl = verified.exp - verified.iat;
            expect(ttl).toBe(3600);
        }
    });
});

describe('comparePassword', () => {
    it('should compare password', async () => {
        const password = 'mysecretpassword';
        const hash = await hashPassword(password);
        const isMatch = await comparePassword(password, hash);
        expect(isMatch).toBe(true);
    });
});