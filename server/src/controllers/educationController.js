import Education from '../models/Education.js';

// @desc    Get all education records
// @route   GET /api/education
// @access  Public
export const getEducations = async (req, res, next) => {
  try {
    const educations = await Education.find().sort({ startYear: -1 });
    res.status(200).json({
      success: true,
      message: 'Education fetched successfully',
      data: educations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an education record
// @route   POST /api/education
// @access  Private
export const createEducation = async (req, res, next) => {
  try {
    const { degree, institution, startYear, endYear, description } = req.body;

    if (!degree || !institution || !startYear || !endYear) {
      res.status(400);
      throw new Error('Please provide degree, institution, startYear, and endYear');
    }

    const education = await Education.create({
      degree,
      institution,
      startYear,
      endYear,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Education record created successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an education record
// @route   PUT /api/education/:id
// @access  Private
export const updateEducation = async (req, res, next) => {
  try {
    let education = await Education.findById(req.params.id);

    if (!education) {
      res.status(404);
      throw new Error('Education record not found');
    }

    education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Education record updated successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an education record
// @route   DELETE /api/education/:id
// @access  Private
export const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      res.status(404);
      throw new Error('Education record not found');
    }

    await education.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Education record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
