const express = require('express');
const { uploadResume, listResumes, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

const handleUpload = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

router.use(protect);

router.post('/upload', handleUpload, uploadResume);
router.get('/list', listResumes);
router.delete('/delete/:id', deleteResume);

module.exports = router;
