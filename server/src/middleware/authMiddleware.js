import jwt from 'jsonwebtoken';
import { dbFetchOne } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export const authenticateAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id === 'mock_user_id_123') {
      req.user = { _id: 'mock_user_id_123', id: 'mock_user_id_123', email: 'abhijeet.chavan.dev@gmail.com' };
      return next();
    }

    if (isSupabaseConfigured()) {
      try {
        const adminUser = await dbFetchOne('admin_users', { id: decoded.id });
        if (adminUser) {
          req.user = { _id: adminUser.id, id: adminUser.id, email: adminUser.email, role: adminUser.role };
          return next();
        }
      } catch (err) {
        console.warn('[Supabase Auth Middleware Error]:', err.message);
      }
    }

    req.user = { _id: decoded.id, id: decoded.id, email: 'admin' };
    return next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(401);
    return next(new Error('Not authorized, token failed'));
  }
};
