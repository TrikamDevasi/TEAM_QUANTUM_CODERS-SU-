import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRE || '7d') as any }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Name, email and password are required',
      });
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'Email already registered. Please login instead.',
      });
    }

    // 3. Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Password must be at least 8 characters',
      });
    }

    // 4. Validate role
    const allowedRoles = ['student', 'institute', 'industry', 'government', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    // 5. Create user (password hashed in pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      isVerified: false,
      authProvider: 'local',
    });

    // 6. Generate JWT
    const token = generateToken(user._id.toString(), user.role);

    // 7. Return success (never return password)
    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        token,
      },
      message: 'Registration successful',
    });

  } catch (err: any) {
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'Email already registered',
      });
    }
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({
        success: false,
        data: null,
        message: messages.join(', '),
      });
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Email and password are required',
      });
    }

    // Find user and include password field (normally excluded)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
      });
    }

    // Check if user registered via OAuth
    if (user.authProvider !== 'local' || !user.password) {
      return res.status(401).json({
        success: false,
        data: null,
        message: `This account uses ${user.authProvider} login. Please sign in with ${user.authProvider}.`,
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        token,
      },
      message: 'Login successful',
    });

  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is already fetched in protect middleware
    const user = req.user;
    return res.status(200).json({
      success: true,
      data: { user },
      message: 'User fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Placeholder for missing exports if any routes still reference them
export const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ success: false, message: 'Refresh token logic temporarily disabled during security audit' });
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
