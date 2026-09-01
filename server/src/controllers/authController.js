import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password');
    }

    // Bypass DB check since MongoDB is not running locally
    if (email === 'abhijeet.chavan.dev@gmail.com' && password === 'admin12345') {
      const token = generateToken('mock_user_id_123');

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
          id: 'mock_user_id_123',
          email: 'abhijeet.chavan.dev@gmail.com',
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Private
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

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    // Bypass DB check since MongoDB is not running locally
    if (req.user && req.user._id === 'mock_user_id_123') {
      return res.status(200).json({
        success: true,
        data: {
          _id: 'mock_user_id_123',
          email: 'abhijeet.chavan.dev@gmail.com'
        }
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
