const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body } = require('express-validator');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Validation middleware
const saveResumeValidation = [
  body('resumeName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Resume name must be between 1 and 100 characters'),
  body('template')
    .isIn(['professional', 'creative', 'minimal', 'technical'])
    .withMessage('Invalid template type'),
  body('resumeData')
    .custom((value) => {
      try {
        // Parse the JSON string to validate it's valid JSON
        const parsed = JSON.parse(value);
        // Check if it's an object
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Resume data must be a valid object');
        }
        return true;
      } catch (error) {
        throw new Error('Resume data must be valid JSON');
      }
    })
    .withMessage('Resume data must be a valid JSON object')
];

// Routes
router.post('/save', authMiddleware, upload.single('resumePdf'), saveResumeValidation, resumeController.saveResume);
router.get('/list', authMiddleware, resumeController.getUserResumes);
router.get('/download/:resumeId', authMiddleware, resumeController.downloadResume);
router.delete('/delete/:resumeId', authMiddleware, resumeController.deleteResume);
router.put('/update/:resumeId', authMiddleware, upload.single('resumePdf'), saveResumeValidation, resumeController.updateResume);

module.exports = router;