const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { extractTextFromPDF } = require('../services/pdfService');
const { analyzeResume } = require('../services/nlpService');

// @desc    Analyze uploaded resume
// @route   POST /api/resume/analyze
const analyzeResumeController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    const filePath = req.file.path;

    // Extract text from PDF
    const rawText = await extractTextFromPDF(filePath);
    if (!rawText || rawText.trim().length < 50) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: 'Could not extract text from PDF. Ensure it is not a scanned image.' });
    }

    // Analyze with NLP
    const analysis = analyzeResume(rawText);

    // Save to DB
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      rawText,
      ...analysis
    });

    // Update user's total analyses
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalAnalyses: 1 } });

    res.json({
      success: true,
      data: {
        _id: resume._id,
        originalName: resume.originalName,
        score: resume.score,
        breakdown: resume.breakdown,
        domain: resume.domain,
        extractedSkills: resume.extractedSkills,
        missingSkills: resume.missingSkills,
        suggestions: resume.suggestions,
        jobRoles: resume.jobRoles,
        experience: resume.experience,
        analysisDate: resume.analysisDate
      }
    });

    // Clean up file after analysis
    setTimeout(() => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, 5000);

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all resumes for current user
// @route   GET /api/resume/history
const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ analysisDate: -1 })
      .select('-rawText');
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume analysis
// @route   GET /api/resume/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id }).select('-rawText');
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume analysis
// @route   DELETE /api/resume/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalAnalyses: -1 } });
    res.json({ success: true, message: 'Analysis deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeResumeController, getResumeHistory, getResumeById, deleteResume };
