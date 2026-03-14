import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import User from '../models/User.model';
import { hashPassword } from '../utils/hash.utils';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['student', 'institute', 'industry', 'government', 'admin']),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: body.email });
    if (existing) {
      res.status(400).json({ success: false, data: null, message: 'Email is already registered' });
      return;
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password, // hashed by pre-save
      role: body.role,
      phone: body.phone,
    });

    const accessToken = signAccessToken(String(user._id), user.role);
    const refreshToken = signRefreshToken(String(user._id));

    await User.findByIdAndUpdate(user._id, { refreshToken: await hashPassword(refreshToken) });

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.refreshToken;

    res.status(201).json({
      success: true,
      data: { user: userObj, accessToken, refreshToken },
      message: 'Registration successful',
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await User.findOne({ email: body.email }).select('+password +refreshToken');
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });
      return;
    }

    const valid = await user.comparePassword(body.password);
    if (!valid) {
      res.status(401).json({ success: false, data: null, message: 'Invalid credentials' });
      return;
    }

    const accessToken = signAccessToken(String(user._id), user.role);
    const refreshToken = signRefreshToken(String(user._id));

    await User.findByIdAndUpdate(user._id, { refreshToken: await hashPassword(refreshToken) });

    const userObj = user.toObject() as unknown as Record<string, unknown>;
    delete userObj.password;
    delete userObj.refreshToken;

    res.status(200).json({
      success: true,
      data: { user: userObj, accessToken, refreshToken },
      message: 'Login successful',
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ success: false, data: null, message: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, data: null, message: 'User not found or inactive' });
      return;
    }

    const newAccessToken = signAccessToken(String(user._id), user.role);
    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
      message: 'Token refreshed',
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: undefined });
    }
    res.status(200).json({ success: true, data: null, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password -refreshToken');
    if (!user) {
      res.status(404).json({ success: false, data: null, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user, message: 'User retrieved' });
  } catch (err) {
    next(err);
  }
};
