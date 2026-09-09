import { dbFetchAll, dbInsert, dbUpdate, dbDelete } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export const getSkills = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const skills = await dbFetchAll('skills', { orderBy: 'created_at', ascending: true });
        if (skills && skills.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Skills fetched successfully from Supabase',
            data: skills,
          });
        }
      } catch (err) {
        console.warn('[Supabase Skills Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Skills fetched (empty/fallback)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const { name, category, level, proficiency, icon } = req.body;

    if (!name || !category || !level) {
      res.status(400);
      throw new Error('Please provide name, category, and level');
    }

    if (isSupabaseConfigured()) {
      const skill = await dbInsert('skills', {
        name,
        category,
        level,
        proficiency: proficiency ? parseInt(proficiency, 10) : 80,
        icon: icon || '',
      });

      return res.status(201).json({
        success: true,
        message: 'Skill created successfully in Supabase',
        data: skill,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to create skill',
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const updated = await dbUpdate('skills', id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Skill updated successfully in Supabase',
        data: updated,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update skill',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      await dbDelete('skills', id);
      return res.status(200).json({
        success: true,
        message: 'Skill deleted successfully from Supabase',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to delete skill',
    });
  } catch (error) {
    next(error);
  }
};
