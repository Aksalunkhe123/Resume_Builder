const express = require('express');
const router = express.Router();
const {
  getCompanyReadinessReports,
  generateCompanyReadiness,
  getCompanyReadiness,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All company routes require authentication

router.route('/')
  .get(getCompanyReadinessReports);

router.route('/:companyName')
  .get(getCompanyReadiness)
  .post(generateCompanyReadiness);

module.exports = router;
