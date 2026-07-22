require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const companyRoutes = require('./routes/companyRoutes');
const resumeBuilderRoutes = require('./routes/resumeBuilderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SkillBridge AI API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/student-profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/company-readiness', companyRoutes);
app.use('/api/resume-builder', resumeBuilderRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File size exceeds the 5MB limit.' });
  }
  if (err.message === 'Only PDF and DOCX files are allowed.') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.message === 'Only JPG, PNG, WEBP, and GIF images are allowed.') {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`SkillBridge AI server running on port ${PORT}`);
});
