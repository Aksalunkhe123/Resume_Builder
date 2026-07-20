const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^[+]?[\d\s-]{10,15}$/.test(v),
        message: 'Please provide a valid phone number',
      },
    },
    collegeName: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
      maxlength: [150, 'College name cannot exceed 150 characters'],
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
      maxlength: [100, 'Branch cannot exceed 100 characters'],
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be less than 0'],
      max: [10, 'CGPA cannot exceed 10'],
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [2000, 'Graduation year must be 2000 or later'],
      max: [2100, 'Graduation year is invalid'],
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one skill is required',
      },
    },
    certifications: {
      type: [String],
      default: [],
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
      maxlength: [100, 'Target role cannot exceed 100 characters'],
    },
    targetCompany: {
      type: String,
      trim: true,
      maxlength: [100, 'Target company cannot exceed 100 characters'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    profilePicturePath: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
