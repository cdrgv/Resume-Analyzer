const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Resume = require('../models/Resume');

// @desc Get user dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalAnalyses = await Resume.countDocuments({ user: req.user._id });
    const analyses = await Resume.find({ user: req.user._id }).select('score domain analysisDate');
    const avgScore = analyses.length > 0
      ? Math.round(analyses.reduce((sum, r) => sum + r.score, 0) / analyses.length)
      : 0;
    const bestScore = analyses.length > 0 ? Math.max(...analyses.map(r => r.score)) : 0;

    res.json({
      success: true,
      data: { totalAnalyses, avgScore, bestScore }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
