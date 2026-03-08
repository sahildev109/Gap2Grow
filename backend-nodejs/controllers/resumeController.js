const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');

// Get all resumes for user
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId })
      .sort({ uploadedAt: -1 });

    res.status(200).json({
      count: resumes.length,
      resumes
    });
  } catch (err) {
    console.error('Get resumes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current resume
exports.getCurrentResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.userId, isCurrent: true });

    if (!resume) {
      return res.status(404).json({ error: 'No current resume found' });
    }

    res.status(200).json(resume);
  } catch (err) {
    console.error('Get current resume error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only PDF and DOC files are allowed' });
    }

    // Validate file size (5MB)
    if (req.file.size > 5242880) {
      return res.status(400).json({ error: 'File size must be less than 5MB' });
    }

    // Mark existing resume as not current
    await Resume.updateMany({ userId: req.user.userId }, { isCurrent: false });

    // Create new resume document
    const resume = new Resume({
      userId: req.user.userId,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      processingStatus: 'Processing'
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded successfully. Processing started.',
      resume
    });
  } catch (err) {
    console.error('Upload resume error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update resume
exports.updateResume = async (req, res) => {
  try {
    const { extractedData, processingStatus, skillsExtracted, experienceLevel} = req.body;

    const resume = await Resume.findById(req.params.resumeId);

    if (!resume || resume.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (extractedData) resume.extractedData = extractedData;
    if (processingStatus) resume.processingStatus = processingStatus;
    if (skillsExtracted) resume.skillsExtracted = skillsExtracted;
    if (experienceLevel) resume.experienceLevel = experienceLevel;
    resume.updatedAt = new Date();

    await resume.save();

    res.status(200).json({
      message: 'Resume updated successfully',
      resume
    });
  } catch (err) {
    console.error('Update resume error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);

    if (!resume || resume.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file
    const filePath = path.join(__dirname, '..', 'uploads', path.basename(resume.fileUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.findByIdAndDelete(req.params.resumeId);

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Delete resume error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
