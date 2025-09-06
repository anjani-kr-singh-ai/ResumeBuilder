const fs = require('fs').promises;
const path = require('path');
const { validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const zlib = require('zlib');
const { v4: uuidv4 } = require('uuid');
const Resume = require('../models/Resume');

// Ensure resumes directory exists
const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

// Compress PDF buffer
const compressPDF = async (pdfBuffer) => {
  return new Promise((resolve, reject) => {
    zlib.gzip(pdfBuffer, (err, compressed) => {
      if (err) reject(err);
      else resolve(compressed);
    });
  });
};

// Decompress PDF buffer
const decompressPDF = async (compressedBuffer) => {
  return new Promise((resolve, reject) => {
    zlib.gunzip(compressedBuffer, (err, decompressed) => {
      if (err) reject(err);
      else resolve(decompressed);
    });
  });
};

// Save resume to cloud
const saveResume = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { resumeName, template } = req.body;
    // Parse resumeData from JSON string
    let resumeData;
    try {
      resumeData = JSON.parse(req.body.resumeData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resume data format'
      });
    }
    
    const userEmail = req.user.email;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    // Create user-specific directory
    const userDir = path.join(__dirname, '..', 'storage', 'Resumes', userEmail);
    await ensureDirectoryExists(userDir);

    // Generate unique filename
    const resumeId = uuidv4();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${resumeName}_${template}_${timestamp}.pdf.gz`;
    const filePath = path.join(userDir, filename);

    // Compress PDF
    const compressedPDF = await compressPDF(req.file.buffer);

    // Save compressed file
    await fs.writeFile(filePath, compressedPDF);

    // Save resume metadata to database
    const resumeRecord = await Resume.create({
      id: resumeId,
      userId: userId,
      name: resumeName,
      template: template,
      filename: filename,
      filePath: filePath,
      originalSize: req.file.buffer.length,
      compressedSize: compressedPDF.length,
      resumeData: JSON.stringify(resumeData),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Resume saved to cloud successfully',
      resumeId: resumeId,
      compressionRatio: ((req.file.buffer.length - compressedPDF.length) / req.file.buffer.length * 100).toFixed(2)
    });

  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resume to cloud'
    });
  }
};

// Get user's resumes
const getUserResumes = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = await Resume.findByUserId(userId);

    const resumeList = resumes.map(resume => ({
      id: resume.id,
      name: resume.name,
      template: resume.template,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      originalSize: resume.originalSize,
      compressedSize: resume.compressedSize
    }));

    res.status(200).json({
      success: true,
      resumes: resumeList
    });

  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resumes'
    });
  }
};

// Download resume
const downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.id;

    // Find resume record
    const resume = await Resume.findByIdAndUserId(resumeId, userId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Read compressed file
    const compressedData = await fs.readFile(resume.filePath);
    
    // Decompress PDF
    const pdfBuffer = await decompressPDF(compressedData);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.name}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume'
    });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.id;

    // Find resume record
    const resume = await Resume.findByIdAndUserId(resumeId, userId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Delete file
    try {
      await fs.unlink(resume.filePath);
    } catch (fileError) {
      console.warn('File already deleted or not found:', fileError.message);
    }

    // Delete database record
    await Resume.deleteById(resumeId);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });

  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume'
    });
  }
};

// Update resume
const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { resumeName, template, resumeData } = req.body;
    const userId = req.user.id;

    // Find existing resume
    const existingResume = await Resume.findByIdAndUserId(resumeId, userId);
    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    let updateData = {
      name: resumeName || existingResume.name,
      template: template || existingResume.template,
      resumeData: resumeData ? JSON.stringify(resumeData) : existingResume.resumeData,
      updatedAt: new Date()
    };

    // If new PDF file is provided, update it
    if (req.file) {
      const userEmail = req.user.email;
      const userDir = path.join(__dirname, '..', 'storage', 'Resumes', userEmail);
      
      // Delete old file
      try {
        await fs.unlink(existingResume.filePath);
      } catch (error) {
        console.warn('Old file not found:', error.message);
      }

      // Save new compressed file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${updateData.name}_${updateData.template}_${timestamp}.pdf.gz`;
      const filePath = path.join(userDir, filename);
      
      const compressedPDF = await compressPDF(req.file.buffer);
      await fs.writeFile(filePath, compressedPDF);

      updateData = {
        ...updateData,
        filename,
        filePath,
        originalSize: req.file.buffer.length,
        compressedSize: compressedPDF.length
      };
    }

    // Update database record
    await Resume.updateById(resumeId, updateData);

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully'
    });

  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume'
    });
  }
};

module.exports = {
  saveResume,
  getUserResumes,
  downloadResume,
  deleteResume,
  updateResume
};