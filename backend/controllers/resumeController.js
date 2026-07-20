const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const { ALLOWED_MIMES } = require('../middleware/uploadMiddleware');

const formatResume = (resume) => ({
  id: resume._id,
  originalName: resume.originalName,
  fileName: resume.fileName,
  fileType: resume.fileType,
  fileExtension: resume.fileExtension,
  fileSize: resume.fileSize,
  createdAt: resume.createdAt,
  updatedAt: resume.updatedAt,
});

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload.' });
    }

    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileExtension: ALLOWED_MIMES[req.file.mimetype],
      fileSize: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully.',
      data: { resume: formatResume(resume) },
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Server error uploading resume.' });
  }
};

const listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { resumes: resumes.map(formatResume) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching resumes.' });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await Resume.findByIdAndDelete(resume._id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting resume.' });
  }
};

module.exports = { uploadResume, listResumes, deleteResume };
