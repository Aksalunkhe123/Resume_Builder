const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../uploads/profile-pictures');
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_MIMES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = ALLOWED_MIMES[file.mimetype];
    const uniqueName = `profile-${req.user._id}-${Date.now()}.${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed.'), false);
  }
};

const uploadProfilePicture = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

const handleProfilePictureUpload = (req, res, next) => {
  uploadProfilePicture.single('profilePicture')(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

module.exports = { handleProfilePictureUpload, UPLOAD_DIR, ALLOWED_MIMES };
