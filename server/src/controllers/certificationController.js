import { dbFetchAll, dbInsert, dbUpdate, dbDelete } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export const getCertifications = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const certifications = await dbFetchAll('certifications', { orderBy: 'created_at', ascending: false });
        if (certifications) {
          return res.status(200).json({
            success: true,
            message: 'Certifications fetched successfully from Supabase',
            data: certifications,
          });
        }
      } catch (err) {
        console.warn('[Supabase Certifications Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Certifications fetched (empty/fallback)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const createCertification = async (req, res, next) => {
  try {
    const { name, issuingOrganization, date, credentialId, credentialUrl, image } = req.body;

    if (!name || !issuingOrganization || !date) {
      res.status(400);
      throw new Error('Please provide name, issuingOrganization, and date');
    }

    if (isSupabaseConfigured()) {
      const certification = await dbInsert('certifications', {
        name,
        issuingOrganization,
        date,
        credentialId: credentialId || '',
        credentialUrl: credentialUrl || '',
        image: image || '',
      });

      return res.status(201).json({
        success: true,
        message: 'Certification created successfully in Supabase',
        data: certification,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to create certification',
    });
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const updated = await dbUpdate('certifications', id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Certification updated successfully in Supabase',
        data: updated,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update certification',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      await dbDelete('certifications', id);
      return res.status(200).json({
        success: true,
        message: 'Certification deleted successfully from Supabase',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to delete certification',
    });
  } catch (error) {
    next(error);
  }
};
