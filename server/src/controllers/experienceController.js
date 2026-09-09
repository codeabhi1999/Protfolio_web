import { dbFetchAll, dbInsert, dbUpdate, dbDelete } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export const getExperiences = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const experiences = await dbFetchAll('experiences', { orderBy: 'created_at', ascending: false });
        if (experiences && experiences.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Experiences fetched successfully from Supabase',
            data: experiences,
          });
        }
      } catch (err) {
        console.warn('[Supabase Experience Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Experiences fetched (empty/fallback)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const { company, position, startDate, endDate, location, responsibilities, technologies, achievements } = req.body;

    if (!company || !position || !startDate) {
      res.status(400);
      throw new Error('Please provide company, position, and startDate');
    }

    const respArray = Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []);
    const techArray = Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(t => t.trim()) : []);
    const achArray = Array.isArray(achievements) ? achievements : (achievements ? achievements.split('\n').filter(Boolean) : []);

    if (isSupabaseConfigured()) {
      const exp = await dbInsert('experiences', {
        company,
        position,
        startDate,
        endDate: endDate || 'Present',
        location: location || '',
        responsibilities: JSON.stringify(respArray),
        technologies: JSON.stringify(techArray),
        achievements: JSON.stringify(achArray),
      });

      return res.status(201).json({
        success: true,
        message: 'Experience record created successfully in Supabase',
        data: exp,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to create experience record',
    });
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const updateData = { ...req.body };
      if (updateData.responsibilities && Array.isArray(updateData.responsibilities)) {
        updateData.responsibilities = JSON.stringify(updateData.responsibilities);
      }
      if (updateData.technologies && Array.isArray(updateData.technologies)) {
        updateData.technologies = JSON.stringify(updateData.technologies);
      }
      if (updateData.achievements && Array.isArray(updateData.achievements)) {
        updateData.achievements = JSON.stringify(updateData.achievements);
      }

      const updated = await dbUpdate('experiences', id, updateData);
      return res.status(200).json({
        success: true,
        message: 'Experience record updated successfully in Supabase',
        data: updated,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update experience record',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      await dbDelete('experiences', id);
      return res.status(200).json({
        success: true,
        message: 'Experience record deleted successfully from Supabase',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to delete experience record',
    });
  } catch (error) {
    next(error);
  }
};
