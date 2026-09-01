import Profile from '../models/Profile.js';

// @desc    Get profile details
// @route   GET /api/profile
// @access  Public
export const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(200).json({
        success: true,
        message: 'No profile found, please seed or create one.',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();

    if (profile) {
      // Update existing profile
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      // Create new profile if none exists
      profile = await Profile.create(req.body);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
