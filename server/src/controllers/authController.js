import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbFetchOne } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password');
    }

    let authenticatedUserId = null;
    let authenticatedEmail = null;

    if (isSupabaseConfigured()) {
      try {
        const adminUser = await dbFetchOne('admin_users', { email: email.trim().toLowerCase() });
        if (adminUser) {
          const isMatch = await bcrypt.compare(password, adminUser.password);
          if (isMatch) {
            authenticatedUserId = adminUser.id;
            authenticatedEmail = adminUser.email;
          }
        }
      } catch (err) {
        console.warn('[Supabase Auth Warning]:', err.message);
      }
    }

    // Demo Credentials Fallback
    if (!authenticatedUserId) {
      const demoEmail = process.env.ADMIN_EMAIL || 'abhijeet.chavan.dev@gmail.com';
      const demoPassword = process.env.ADMIN_PASSWORD || 'admin12345';

      if (email.trim().toLowerCase() === demoEmail.toLowerCase() && password === demoPassword) {
        authenticatedUserId = 'mock_user_id_123';
        authenticatedEmail = demoEmail;
      }
    }

    if (!authenticatedUserId) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(authenticatedUserId);
    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: authenticatedUserId,
        _id: authenticatedUserId,
        email: authenticatedEmail,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (req.user) {
      return res.status(200).json({
        success: true,
        data: {
          _id: req.user._id || req.user.id,
          id: req.user._id || req.user.id,
          email: req.user.email,
        },
      });
    }

    res.status(401);
    throw new Error('User not authenticated');
  } catch (error) {
    next(error);
  }
};
