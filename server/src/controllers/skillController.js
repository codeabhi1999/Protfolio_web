import Skill from '../models/Skill.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({
      success: true,
      message: 'Skills fetched successfully',
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, level } = req.body;

    if (!name || !category || !level) {
      res.status(400);
      throw new Error('Please provide name, category, and level');
    }

    const skill = await Skill.create({ name, category, level });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
