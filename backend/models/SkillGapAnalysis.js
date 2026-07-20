const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema(
  {
    skill: { type: String, trim: true },
    suggestion: { type: String, trim: true },
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeAnalysis',
    },
    resumeName: {
      type: String,
      trim: true,
      default: '',
    },
    targetRole: {
      type: String,
      required: true,
      enum: ['Java Developer', 'Full Stack Developer', 'Data Analyst', 'Software Engineer'],
    },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalRequired: {
      type: Number,
      required: true,
    },
    existingSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    recommendedSkills: {
      type: [String],
      default: [],
    },
    improvementSuggestions: {
      type: [suggestionSchema],
      default: [],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillGapAnalysis', skillGapSchema);
