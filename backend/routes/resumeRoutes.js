const express = require('express');
const router = express.Router();
const { analyzeResumeController, getResumeHistory, getResumeById, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/analyze', protect, upload.single('resume'), analyzeResumeController);
router.get('/history', protect, getResumeHistory);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);

module.exports = router;
