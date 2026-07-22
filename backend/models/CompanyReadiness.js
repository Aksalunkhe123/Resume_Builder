const mongoose = require('mongoose');

const companyReadinessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      enum: ['TCS', 'Infosys', 'Amazon', 'Walmart', 'Myntra'],
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['completed', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

// Compound index to quickly find a user's readiness for a specific company
companyReadinessSchema.index({ user: 1, companyName: 1 }, { unique: true });

module.exports = mongoose.model('CompanyReadiness', companyReadinessSchema);
