const fs = require('fs');
const StudentProfile = require('../models/StudentProfile');

const formatProfile = (profile) => ({
  id: profile._id,
  fullName: profile.fullName,
  email: profile.email,
  phone: profile.phone,
  collegeName: profile.collegeName,
  degree: profile.degree,
  branch: profile.branch,
  cgpa: profile.cgpa,
  graduationYear: profile.graduationYear,
  skills: profile.skills,
  certifications: profile.certifications,
  targetRole: profile.targetRole,
  targetCompany: profile.targetCompany,
  profilePicture: profile.profilePicture || '',
  profilePictureUrl: profile.profilePicture
    ? `/uploads/profile-pictures/${profile.profilePicture}`
    : '',
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

const parseListField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseProfileBody = (body) => ({
  fullName: body.fullName?.trim(),
  email: body.email?.trim(),
  phone: body.phone?.trim() || '',
  collegeName: body.collegeName?.trim(),
  degree: body.degree?.trim(),
  branch: body.branch?.trim(),
  cgpa: parseFloat(body.cgpa),
  graduationYear: parseInt(body.graduationYear, 10),
  skills: parseListField(body.skills),
  certifications: parseListField(body.certifications),
  targetRole: body.targetRole?.trim(),
  targetCompany: body.targetCompany?.trim() || '',
});

const deleteProfilePictureFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const handleValidationError = (error, res) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  return null;
};

const createProfile = async (req, res) => {
  try {
    const existing = await StudentProfile.findOne({ user: req.user._id });
    if (existing) {
      if (req.file?.path) deleteProfilePictureFile(req.file.path);
      return res.status(409).json({
        success: false,
        message: 'Profile already exists. Use update to modify your profile.',
      });
    }

    const profileData = parseProfileBody(req.body);

    if (req.file) {
      profileData.profilePicture = req.file.filename;
      profileData.profilePicturePath = req.file.path;
    }

    const profile = await StudentProfile.create({ ...profileData, user: req.user._id });

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully.',
      data: { profile: formatProfile(profile) },
    });
  } catch (error) {
    if (req.file?.path) deleteProfilePictureFile(req.file.path);
    const validationResponse = handleValidationError(error, res);
    if (validationResponse) return validationResponse;
    res.status(500).json({ success: false, message: 'Server error creating profile.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    res.status(200).json({
      success: true,
      data: { profile: formatProfile(profile) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const existing = await StudentProfile.findOne({ user: req.user._id });

    if (!existing) {
      if (req.file?.path) deleteProfilePictureFile(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Create a profile first.',
      });
    }

    const profileData = parseProfileBody(req.body);

    if (req.file) {
      deleteProfilePictureFile(existing.profilePicturePath);
      profileData.profilePicture = req.file.filename;
      profileData.profilePicturePath = req.file.path;
    } else if (req.body.removeProfilePicture === 'true') {
      deleteProfilePictureFile(existing.profilePicturePath);
      profileData.profilePicture = '';
      profileData.profilePicturePath = '';
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully.',
      data: { profile: formatProfile(profile) },
    });
  } catch (error) {
    if (req.file?.path) deleteProfilePictureFile(req.file.path);
    const validationResponse = handleValidationError(error, res);
    if (validationResponse) return validationResponse;
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOneAndDelete({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    deleteProfilePictureFile(profile.profilePicturePath);

    res.status(200).json({
      success: true,
      message: 'Student profile deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting profile.' });
  }
};

module.exports = { createProfile, getProfile, updateProfile, deleteProfile };
