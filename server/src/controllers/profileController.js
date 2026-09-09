import { dbFetchOne, dbInsert, dbUpdate } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

const fallbackProfile = {
  _id: 'default_profile_id',
  name: 'Abhijeet Chavan',
  role: '.NET Developer',
  title: '.NET Developer',
  bio: '.NET Developer with 1.8 years of experience in designing, developing, and deploying web applications using ASP.NET, MVC, C#, SQL Server, and frontend technologies like HTML5, CSS3, JavaScript, and Bootstrap Angular.',
  location: 'Nagpur, Maharashtra, INDIA',
  email: 'chavanabhijeet95@gmail.com',
  phone: '7057731248',
  profileImage: '/uploads/profile_placeholder.jpg',
  resumeUrl: '/uploads/resume_placeholder.pdf',
  socialLinks: {
    github: 'https://github.com/abhijeetchavan',
    linkedin: 'https://linkedin.com/in/abhijeetchavan',
    instagram: 'https://instagram.com/abhijeetchavan',
  },
};

export const getProfile = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const profile = await dbFetchOne('profiles', {});
        if (profile) {
          return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully from Supabase',
            data: profile,
          });
        }
      } catch (err) {
        console.warn('[Supabase Profile Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched (fallback)',
      data: fallbackProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      const existing = await dbFetchOne('profiles', {});
      let result;
      if (existing && existing.id) {
        result = await dbUpdate('profiles', existing.id, req.body);
      } else {
        result = await dbInsert('profiles', req.body);
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully in Supabase',
        data: result,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update profile',
    });
  } catch (error) {
    next(error);
  }
};
