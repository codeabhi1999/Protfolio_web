import { dbFetchAll, dbInsert, dbUpdate, dbDelete } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export const getServices = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const services = await dbFetchAll('services', { orderBy: 'created_at', ascending: true });
        if (services && services.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Services fetched successfully from Supabase',
            data: services,
          });
        }
      } catch (err) {
        console.warn('[Supabase Services Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Services fetched (empty/fallback)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide title and description');
    }

    if (isSupabaseConfigured()) {
      const service = await dbInsert('services', {
        title,
        description,
        icon: icon || '',
      });

      return res.status(201).json({
        success: true,
        message: 'Service created successfully in Supabase',
        data: service,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to create service',
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const updated = await dbUpdate('services', id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Service updated successfully in Supabase',
        data: updated,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update service',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      await dbDelete('services', id);
      return res.status(200).json({
        success: true,
        message: 'Service deleted successfully from Supabase',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to delete service',
    });
  } catch (error) {
    next(error);
  }
};
