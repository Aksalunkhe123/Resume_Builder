const CompanyReadiness = require('../models/CompanyReadiness');
const StudentProfile = require('../models/StudentProfile');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const companiesData = require('../config/companies');

// Helper function to normalize skills for comparison
const normalizeSkill = (skill) => skill.toLowerCase().replace(/[^a-z0-9]/g, '');

// @desc    Get all company readiness reports for a user
// @route   GET /api/company-readiness
// @access  Private
exports.getCompanyReadinessReports = async (req, res) => {
  try {
    const reports = await CompanyReadiness.find({ user: req.user._id });
    
    // Return all companies data with their report if exists
    const responseData = Object.values(companiesData).map(company => {
      const report = reports.find(r => r.companyName === company.name);
      return {
        ...company,
        report: report || null
      };
    });

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching company readiness reports:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Generate or update readiness report for a specific company
// @route   POST /api/company-readiness/:companyName
// @access  Private
exports.generateCompanyReadiness = async (req, res) => {
  try {
    const { companyName } = req.params;
    
    if (!companiesData[companyName]) {
      return res.status(400).json({ success: false, message: 'Invalid company name' });
    }

    const companyConfig = companiesData[companyName];

    // Fetch latest resume analysis
    const latestResumeAnalysis = await ResumeAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!latestResumeAnalysis || !latestResumeAnalysis.skills) {
      return res.status(400).json({ success: false, message: 'Please upload and analyze a resume first to generate a company readiness report.' });
    }

    // Use skills ONLY from resume analysis
    const userSkillsSet = new Set();
    
    latestResumeAnalysis.skills.forEach(skill => userSkillsSet.add(normalizeSkill(skill)));

    // Compare with company required skills
    const strengths = [];
    const weaknesses = [];

    companyConfig.requiredSkills.forEach(reqSkill => {
      const normalizedReqSkill = normalizeSkill(reqSkill);
      if (userSkillsSet.has(normalizedReqSkill)) {
        strengths.push(reqSkill); // Keep original casing
      } else {
        weaknesses.push(reqSkill);
      }
    });

    // Calculate score
    const totalRequired = companyConfig.requiredSkills.length;
    const score = totalRequired > 0 ? Math.round((strengths.length / totalRequired) * 100) : 0;

    // Save or update report
    let report = await CompanyReadiness.findOne({ user: req.user._id, companyName });

    if (report) {
      report.score = score;
      report.strengths = strengths;
      report.weaknesses = weaknesses;
      report.status = 'completed';
      await report.save();
    } else {
      report = await CompanyReadiness.create({
        user: req.user._id,
        companyName,
        score,
        strengths,
        weaknesses,
        status: 'completed'
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });

  } catch (error) {
    console.error('Error generating company readiness:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get specific company readiness report
// @route   GET /api/company-readiness/:companyName
// @access  Private
exports.getCompanyReadiness = async (req, res) => {
  try {
    const { companyName } = req.params;
    
    if (!companiesData[companyName]) {
      return res.status(400).json({ success: false, message: 'Invalid company name' });
    }

    const report = await CompanyReadiness.findOne({ user: req.user._id, companyName });
    
    res.status(200).json({
      success: true,
      data: {
        company: companiesData[companyName],
        report: report || null
      },
    });
  } catch (error) {
    console.error('Error fetching company readiness report:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
