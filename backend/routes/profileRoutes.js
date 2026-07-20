const express = require('express');
const { createProfile, getProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { handleProfilePictureUpload } = require('../middleware/profilePictureMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', handleProfilePictureUpload, createProfile);
router.get('/', getProfile);
router.put('/', handleProfilePictureUpload, updateProfile);
router.delete('/', deleteProfile);

module.exports = router;
