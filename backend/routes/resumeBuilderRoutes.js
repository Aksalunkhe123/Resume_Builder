const express = require('express');
const router = express.Router();
const { generateATSResume } = require('../controllers/resumeBuilderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Require authentication

router.route('/generate')
  .post(generateATSResume)
  .get(generateATSResume); // Allow GET as well for easy fetching if state isn't mutated

module.exports = router;
