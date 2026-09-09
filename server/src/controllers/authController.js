import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbFetchOne } from '../config/dbHelper.js';
import { isSupabaseConfigured, pool } from '../config/supabase.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'development_jwt_secret_key_abhijeet', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password',
      });
    }

    let authenticatedUserId = null;
    let authenticatedEmail = null;
    let userFoundInDb = false;

    if (isSupabaseConfigured()) {
      try {
        const adminUser = await dbFetchOne('admin_users', { email: email.trim().toLowerCase() });
        if (adminUser) {
          userFoundInDb = true;
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

    // Demo Credentials Fallback (strictly for offline/demo development without Supabase)
    if (!authenticatedUserId && !userFoundInDb) {
      const demoEmail = process.env.ADMIN_EMAIL || 'abhijeet.chavan.dev@gmail.com';
      const demoPassword = process.env.ADMIN_PASSWORD || 'admin12345';

      if (email.trim().toLowerCase() === demoEmail.toLowerCase() && password === demoPassword) {
        authenticatedUserId = 'mock_user_id_123';
        authenticatedEmail = demoEmail;
      }
    }

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(authenticatedUserId);

    try {
      const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      };
      res.cookie('token', token, cookieOptions);
    } catch (cookieErr) {
      console.warn('[Cookie Setting Warning]:', cookieErr.message);
    }

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
    console.error('[Login Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login',
    });
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

/**
 * Update Admin Login Credentials (Email & Password)
 */
export const updateCredentials = async (req, res, next) => {
  const { currentPassword, newEmail, newPassword } = req.body;
  const userId = req.user?.id || req.user?._id;

  try {
    if (!currentPassword) {
      res.status(400);
      throw new Error('Current password is required to change credentials');
    }

    if (!newEmail && !newPassword) {
      res.status(400);
      throw new Error('Please provide a new email or new password to update');
    }

    // 1. Fetch current admin record
    let adminRecord = null;
    if (isSupabaseConfigured()) {
      adminRecord = await dbFetchOne('admin_users', { id: userId });
      if (!adminRecord && req.user?.email) {
        adminRecord = await dbFetchOne('admin_users', { email: req.user.email.toLowerCase() });
      }
    }

    // 2. Verify current password
    if (adminRecord) {
      const isMatch = await bcrypt.compare(currentPassword, adminRecord.password);
      if (!isMatch) {
        res.status(401);
        throw new Error('Current password does not match');
      }
    } else {
      const demoPassword = process.env.ADMIN_PASSWORD || 'admin12345';
      if (currentPassword !== demoPassword) {
        res.status(401);
        throw new Error('Current password does not match');
      }
    }

    // 3. Prepare updates
    let updatedEmail = adminRecord ? adminRecord.email : (req.user?.email || 'admin');
    const updateFields = {};

    if (newEmail && newEmail.trim()) {
      const formattedEmail = newEmail.trim().toLowerCase();
      // Verify email uniqueness
      if (isSupabaseConfigured()) {
        const existing = await dbFetchOne('admin_users', { email: formattedEmail });
        if (existing && existing.id !== (adminRecord ? adminRecord.id : null)) {
          res.status(400);
          throw new Error('This email address is already in use by another admin');
        }
      }
      updatedEmail = formattedEmail;
      updateFields.email = formattedEmail;
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
      }
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(newPassword.trim(), salt);
    }

    // 4. Update in database
    let finalId = adminRecord ? adminRecord.id : userId;
    if (isSupabaseConfigured() && pool) {
      if (adminRecord) {
        await pool.query(
          `UPDATE public.admin_users 
           SET email = COALESCE($1, email),
               password = COALESCE($2, password),
               updated_at = NOW()
           WHERE id = $3`,
          [updateFields.email || null, updateFields.password || null, adminRecord.id]
        );
      } else {
        const defaultHash = updateFields.password || await bcrypt.hash(currentPassword, await bcrypt.genSalt(10));
        const inserted = await pool.query(
          `INSERT INTO public.admin_users (email, password, role) 
           VALUES ($1, $2, 'admin') 
           RETURNING id, email`,
          [updatedEmail, defaultHash]
        );
        if (inserted.rows.length > 0) {
          finalId = inserted.rows[0].id;
        }
      }
    }

    // 5. Generate fresh token
    const token = generateToken(finalId);
    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Login credentials updated successfully!',
      token,
      user: {
        id: finalId,
        _id: finalId,
        email: updatedEmail,
      },
    });
  } catch (error) {
    next(error);
  }
};
