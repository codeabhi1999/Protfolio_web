import { dbFetchAll, dbInsert, dbUpdate, dbDelete } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export const getEducations = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const educations = await dbFetchAll('educations', { orderBy: 'start_year', ascending: false });
        if (educations && educations.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Education fetched successfully from Supabase',
            data: educations,
          });
        }
      } catch (err) {
        console.warn('[Supabase Education Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Education fetched (empty/fallback)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const createEducation = async (req, res, next) => {
  try {
    const { degree, institution, startYear, endYear, description } = req.body;

    if (!degree || !institution || !startYear || !endYear) {
      res.status(400);
      throw new Error('Please provide degree, institution, startYear, and endYear');
    }

    if (isSupabaseConfigured()) {
      const education = await dbInsert('educations', {
        degree,
        institution,
        startYear,
        endYear,
        description: description || '',
      });

      return res.status(201).json({
        success: true,
        message: 'Education record created successfully in Supabase',
        data: education,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to create education record',
    });
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const updated = await dbUpdate('educations', id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Education record updated successfully in Supabase',
        data: updated,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update education record',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      await dbDelete('educations', id);
      return res.status(200).json({
        success: true,
        message: 'Education record deleted successfully from Supabase',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to delete education record',
    });
  } catch (error) {
    next(error);
  }
};
