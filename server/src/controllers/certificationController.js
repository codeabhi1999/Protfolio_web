import Certification from '../models/Certification.js';

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
export const getCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      message: 'Certifications fetched successfully',
      data: certifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a certification
// @route   POST /api/certifications
// @access  Private
export const createCertification = async (req, res, next) => {
  try {
    const { name, issuingOrganization, date, credentialId, credentialUrl, image } = req.body;

    if (!name || !issuingOrganization || !date) {
      res.status(400);
      throw new Error('Please provide name, issuingOrganization, and date');
    }

    const certification = await Certification.create({
      name,
      issuingOrganization,
      date,
      credentialId,
      credentialUrl,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Certification created successfully',
      data: certification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a certification
// @route   PUT /api/certifications/:id
// @access  Private
export const updateCertification = async (req, res, next) => {
  try {
    let certification = await Certification.findById(req.params.id);

    if (!certification) {
      res.status(404);
      throw new Error('Certification not found');
    }

    certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Certification updated successfully',
      data: certification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a certification
// @route   DELETE /api/certifications/:id
// @access  Private
export const deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      res.status(404);
      throw new Error('Certification not found');
    }

    await certification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Certification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
