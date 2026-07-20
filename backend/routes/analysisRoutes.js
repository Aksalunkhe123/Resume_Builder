const express = require('express');
const { analyzeResume, listAnalyses, getAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/analyze/:resumeId', analyzeResume);
router.get('/list', listAnalyses);
router.get('/:id', getAnalysis);

module.exports = router;
