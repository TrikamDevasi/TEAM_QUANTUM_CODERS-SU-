import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import logger from '../utils/logger';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';
import { AuthenticatedRequest } from '../types';

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/profile
 * @access  Private
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as unknown as AuthenticatedRequest).user?.id || (req as any).user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/profile/update
 * @access  Private
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, bio, location, skills } = req.body;
    
    const userId = (req as unknown as AuthenticatedRequest).user?.id || (req as any).user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim());

    await user.save();

    res.status(200).json({ success: true, data: user, message: 'Profile updated successfully!' });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Upload avatar
 * @route   POST /api/v1/profile/avatar
 * @access  Private
 */
export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const userId = (req as unknown as AuthenticatedRequest).user?.id || (req as any).user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Upload to Cloudinary using stream
    const streamUpload = (req: Request) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'skillsense/avatars',
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        Readable.from(req.file!.buffer).pipe(stream);
      });
    };

    const result = (await streamUpload(req)) as any;
    
    user.avatar = result.secure_url;
    await user.save();

    res.status(200).json({ success: true, data: user.avatar, message: 'Avatar updated successfully!' });
  } catch (err) {
    logger.error('Avatar upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload avatar' });
  }
};
