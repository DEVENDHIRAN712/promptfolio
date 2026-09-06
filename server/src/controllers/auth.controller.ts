import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { AuthRequest } from '../middleware/auth';
import { getJwtSecret } from '../config/jwt';

const generateToken = (userId: string): string => {
  const secret = getJwtSecret();
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// POST /api/auth/register - Direct registration creating user & issuing JWT
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      res.status(400).json({ message: 'Full name must be at least 2 characters.' });
      return;
    }

    if (!email || !email.includes('@')) {
      res.status(400).json({ message: 'Please provide a valid email address.' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(409).json({ message: 'An account with this email address already exists. Please log in.' });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // Automatically create initial Profile for the new user
    await Profile.create({
      userId: user._id,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ message: 'Server error during registration.', error: (error as Error).message });
  }
};

// POST /api/auth/login - Authenticates user & issues JWT
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email address and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ message: 'Server error during login.', error: (error as Error).message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const profile = await Profile.findOne({ userId: req.user._id });

    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      profile: profile || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user profile.', error: (error as Error).message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Logout successful' });
};
