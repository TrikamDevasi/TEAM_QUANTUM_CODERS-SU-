import { RequestHandler } from 'express';
import { UserRole } from '../types';

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ success: false, message: 'Forbidden', data: null });
      return;
    }
    next();
  };
};
