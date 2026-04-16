const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  breakdown: {
    skills: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    education: { type: Number, default: 0 },
    keywords: { type: Number, default: 0 }
  },
  domain: {
    type: String,
    default: 'General'
  },
  extractedSkills: [String],
  missingSkills: [String],
  suggestions: [String],
  jobRoles: [String],
  experience: {
    years: { type: Number, default: 0 },
    level: { type: String, default: 'Entry Level' }
  },
  rawText: {
    type: String,
    select: false
  },
  analysisDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
