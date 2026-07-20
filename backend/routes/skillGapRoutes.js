const express = require('express');
const {
  getRoles,
  previewSkillGap,
  analyzeSkillGap,
  listSkillGaps,
  getSkillGap,
} = require('../controllers/skillGapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/roles', getRoles);
router.post('/preview', previewSkillGap);
router.post('/analyze', analyzeSkillGap);
router.get('/list', listSkillGaps);
router.get('/:id', getSkillGap);

module.exports = router;
