import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateAdmin = async (req, res, next) => {
  let token;

  // Retrieve token from Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.id === 'mock_user_id_123') {
        req.user = { _id: 'mock_user_id_123', email: 'abhijeet.chavan.dev@gmail.com' };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  // Retrieve token from HTTP-only cookie if available
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id === 'mock_user_id_123') {
        req.user = { _id: 'mock_user_id_123', email: 'abhijeet.chavan.dev@gmail.com' };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }
      }
      return next();
    } catch (error) {
      console.error('Cookie JWT Verification Error:', error.message);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};
