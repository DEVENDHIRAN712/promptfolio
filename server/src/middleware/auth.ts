import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'promptfolio_jwt_secret_key_change_in_prod';

    const decoded = jwt.verify(token, secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User associated with token no longer exists.' });
      return;
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.', error: (error as Error).message });
  }
};
