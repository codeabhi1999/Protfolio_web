import Project from '../models/Project.js';

// @desc    Get all projects (with optional filters)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const filter = {};
    
    // Support filtering by featured status
    if (req.query.featured) {
      filter.featured = req.query.featured === 'true';
    }

    // Support filtering by category
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID or slug
// @route   GET /api/projects/:idOrSlug
// @access  Public
export const getProject = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let project;

    // Check if it's a valid Mongoose ObjectId, otherwise query by slug
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(idOrSlug);
    } else {
      project = await Project.findOne({ slug: idOrSlug });
    }

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const { title, description, detailedDescription, technologies, category, image, githubUrl, liveUrl, featured } = req.body;

    if (!title || !description || !technologies || !category) {
      res.status(400);
      throw new Error('Please provide title, description, technologies, and category');
    }

    const project = await Project.create({
      title,
      description,
      detailedDescription,
      technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim()),
      category,
      image,
      githubUrl,
      liveUrl,
      featured: featured === true || featured === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const updateData = { ...req.body };
    
    // Parse technologies if passed as comma separated string or process if array
    if (updateData.technologies) {
      updateData.technologies = Array.isArray(updateData.technologies)
        ? updateData.technologies
        : updateData.technologies.split(',').map(t => t.trim());
    }

    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === true || updateData.featured === 'true';
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
