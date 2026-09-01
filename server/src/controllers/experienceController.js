import Experience from '../models/Experience.js';

// @desc    Get all experience records
// @route   GET /api/experience
// @access  Public
export const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 }); // Sort by creation or custom order if needed
    res.status(200).json({
      success: true,
      message: 'Experiences fetched successfully',
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an experience record
// @route   POST /api/experience
// @access  Private
export const createExperience = async (req, res, next) => {
  try {
    const { company, position, startDate, endDate, location, responsibilities, technologies, achievements } = req.body;

    if (!company || !position || !startDate) {
      res.status(400);
      throw new Error('Please provide company, position, and startDate');
    }

    const experience = await Experience.create({
      company,
      position,
      startDate,
      endDate: endDate || 'Present',
      location,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(t => t.trim()) : []),
      achievements: Array.isArray(achievements) ? achievements : (achievements ? achievements.split('\n').filter(Boolean) : []),
    });

    res.status(201).json({
      success: true,
      message: 'Experience record created successfully',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an experience record
// @route   PUT /api/experience/:id
// @access  Private
export const updateExperience = async (req, res, next) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      res.status(404);
      throw new Error('Experience record not found');
    }

    const updateData = { ...req.body };
    if (updateData.responsibilities && !Array.isArray(updateData.responsibilities)) {
      updateData.responsibilities = updateData.responsibilities.split('\n').filter(Boolean);
    }
    if (updateData.technologies && !Array.isArray(updateData.technologies)) {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
    }
    if (updateData.achievements && !Array.isArray(updateData.achievements)) {
      updateData.achievements = updateData.achievements.split('\n').filter(Boolean);
    }

    experience = await Experience.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Experience record updated successfully',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an experience record
// @route   DELETE /api/experience/:id
// @access  Private
export const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      res.status(404);
      throw new Error('Experience record not found');
    }

    await experience.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Experience record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
