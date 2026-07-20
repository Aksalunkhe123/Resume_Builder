const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { extractResumeText } = require('../services/resumeParser');
const { analyzeResumeWithGemini } = require('../services/geminiService');

const formatAnalysis = (analysis) => ({
  id: analysis._id,
  resumeId: analysis.resume,
  resumeName: analysis.resumeName,
  summary: analysis.summary,
  skills: analysis.skills,
  projects: analysis.projects,
  certifications: analysis.certifications,
  education: analysis.education,
  strengths: analysis.strengths,
  weaknesses: analysis.weaknesses,
  missingKeywords: analysis.missingKeywords,
  status: analysis.status,
  createdAt: analysis.createdAt,
  updatedAt: analysis.updatedAt,
});

const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const extractedText = await extractResumeText(resume.filePath, resume.fileExtension);
    const analysisResult = await analyzeResumeWithGemini(extractedText);

    const analysis = await ResumeAnalysis.create({
      user: req.user._id,
      resume: resume._id,
      resumeName: resume.originalName,
      extractedText,
      ...analysisResult,
      status: 'completed',
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully.',
      data: { analysis: formatAnalysis(analysis) },
    });
  } catch (error) {
    console.error('Analysis error:', error.message);

    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(503).json({ success: false, message: error.message });
    }

    if (error.message.includes('extract') || error.message.includes('Unsupported')) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume. Please try again.',
    });
  }
};

const listAnalyses = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-extractedText');

    res.status(200).json({
      success: true,
      data: { analyses: analyses.map(formatAnalysis) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching analyses.' });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('-extractedText');

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' });
    }

    res.status(200).json({
      success: true,
      data: { analysis: formatAnalysis(analysis) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching analysis.' });
  }
};

module.exports = { analyzeResume, listAnalyses, getAnalysis };
