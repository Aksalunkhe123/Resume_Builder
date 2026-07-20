const ResumeAnalysis = require('../models/ResumeAnalysis');
const SkillGapAnalysis = require('../models/SkillGapAnalysis');
const { SUPPORTED_ROLES, computeSkillGap } = require('../data/roleRequirements');

const formatSkillGap = (gap) => ({
  id: gap._id,
  resumeAnalysisId: gap.resumeAnalysis,
  resumeName: gap.resumeName,
  targetRole: gap.targetRole,
  matchPercentage: gap.matchPercentage,
  totalRequired: gap.totalRequired,
  existingSkills: gap.existingSkills,
  missingSkills: gap.missingSkills,
  recommendedSkills: gap.recommendedSkills,
  improvementSuggestions: gap.improvementSuggestions,
  createdAt: gap.createdAt,
  updatedAt: gap.updatedAt,
});

const getResumeSkills = async (userId, analysisId) => {
  const analysis = await ResumeAnalysis.findOne({ _id: analysisId, user: userId }).select('skills resumeName');

  if (!analysis) {
    throw { status: 404, message: 'Resume analysis not found. Run AI analysis first.' };
  }

  if (!analysis.skills?.length) {
    throw { status: 400, message: 'No skills found in resume analysis. Re-analyze the resume.' };
  }

  return { skills: analysis.skills, resumeName: analysis.resumeName, analysisId: analysis._id };
};

const getRoles = (req, res) => {
  res.status(200).json({
    success: true,
    data: { roles: SUPPORTED_ROLES },
  });
};

const previewSkillGap = async (req, res) => {
  try {
    const { analysisId, targetRole } = req.body;

    if (!analysisId || !targetRole) {
      return res.status(400).json({ success: false, message: 'analysisId and targetRole are required.' });
    }

    const { skills } = await getResumeSkills(req.user._id, analysisId);
    const result = computeSkillGap(skills, targetRole);

    res.status(200).json({
      success: true,
      message: 'Skill gap preview generated.',
      data: { preview: result },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    res.status(400).json({ success: false, message: error.message || 'Failed to generate preview.' });
  }
};

const analyzeSkillGap = async (req, res) => {
  try {
    const { analysisId, targetRole } = req.body;

    if (!analysisId || !targetRole) {
      return res.status(400).json({ success: false, message: 'analysisId and targetRole are required.' });
    }

    const { skills, resumeName, analysisId: resumeAnalysisId } = await getResumeSkills(req.user._id, analysisId);
    const result = computeSkillGap(skills, targetRole);

    const gap = await SkillGapAnalysis.create({
      user: req.user._id,
      resumeAnalysis: resumeAnalysisId,
      resumeName,
      ...result,
      isPreview: false,
    });

    res.status(201).json({
      success: true,
      message: 'Skill gap analysis saved successfully.',
      data: { skillGap: formatSkillGap(gap) },
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    res.status(400).json({ success: false, message: error.message || 'Failed to analyze skill gap.' });
  }
};

const listSkillGaps = async (req, res) => {
  try {
    const gaps = await SkillGapAnalysis.find({ user: req.user._id, isPreview: false }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { skillGaps: gaps.map(formatSkillGap) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching skill gap analyses.' });
  }
};

const getSkillGap = async (req, res) => {
  try {
    const gap = await SkillGapAnalysis.findOne({ _id: req.params.id, user: req.user._id });

    if (!gap) {
      return res.status(404).json({ success: false, message: 'Skill gap analysis not found.' });
    }

    res.status(200).json({
      success: true,
      data: { skillGap: formatSkillGap(gap) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching skill gap analysis.' });
  }
};

module.exports = { getRoles, previewSkillGap, analyzeSkillGap, listSkillGaps, getSkillGap };
