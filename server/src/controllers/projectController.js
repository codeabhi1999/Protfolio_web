import { dbFetchAll, dbFetchOne, dbInsert, dbUpdate, dbDelete } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

export const getProjects = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const where = {};
        if (req.query.featured) {
          where.featured = req.query.featured === 'true';
        }
        if (req.query.category && req.query.category !== 'All') {
          where.category = req.query.category;
        }

        const projects = await dbFetchAll('projects', {
          orderBy: 'created_at',
          ascending: false,
          where: Object.keys(where).length > 0 ? where : null,
        });

        if (projects && projects.length > 0) {
          return res.status(200).json({
            success: true,
            message: 'Projects fetched successfully from Supabase',
            data: projects,
          });
        }
      } catch (err) {
        console.warn('[Supabase Projects Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Projects fetched (empty/fallback)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (isSupabaseConfigured()) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const project = isUUID
        ? await dbFetchOne('projects', { id: idOrSlug })
        : await dbFetchOne('projects', { slug: idOrSlug });

      if (project) {
        return res.status(200).json({
          success: true,
          message: 'Project fetched successfully from Supabase',
          data: project,
        });
      }
    }

    res.status(404);
    throw new Error('Project not found');
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, description, detailedDescription, technologies, category, image, githubUrl, liveUrl, featured } = req.body;

    if (!title || !description || !technologies || !category) {
      res.status(400);
      throw new Error('Please provide title, description, technologies, and category');
    }

    const techArray = Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim());
    const isFeatured = featured === true || featured === 'true';
    const slug = slugify(title);

    if (isSupabaseConfigured()) {
      const project = await dbInsert('projects', {
        title,
        slug,
        description,
        detailedDescription: detailedDescription || '',
        technologies: JSON.stringify(techArray),
        category,
        image: image || '',
        githubUrl: githubUrl || '',
        liveUrl: liveUrl || '',
        featured: isFeatured,
      });

      return res.status(201).json({
        success: true,
        message: 'Project created successfully in Supabase',
        data: project,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to create project',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      const updateData = { ...req.body };
      if (updateData.technologies && Array.isArray(updateData.technologies)) {
        updateData.technologies = JSON.stringify(updateData.technologies);
      } else if (updateData.technologies && typeof updateData.technologies === 'string' && !updateData.technologies.startsWith('[')) {
        updateData.technologies = JSON.stringify(updateData.technologies.split(',').map(t => t.trim()));
      }
      if (updateData.featured !== undefined) {
        updateData.featured = updateData.featured === true || updateData.featured === 'true';
      }
      if (updateData.title && !updateData.slug) {
        updateData.slug = slugify(updateData.title);
      }

      const updated = await dbUpdate('projects', id, updateData);
      return res.status(200).json({
        success: true,
        message: 'Project updated successfully in Supabase',
        data: updated,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update project',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      await dbDelete('projects', id);
      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully from Supabase',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to delete project',
    });
  } catch (error) {
    next(error);
  }
};
