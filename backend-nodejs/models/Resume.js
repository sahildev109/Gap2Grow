const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  extractedData: {
    fullName: String,
    email: String,
    phone: String,
    summary: String,
    experiences: [{
      jobTitle: String,
      company: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      graduationDate: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String]
    }]
  },
  processingStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed'],
    default: 'Pending'
  },
  skillsExtracted: [{
    type: String
  }],
  experienceLevel: {
    type: String,
    enum: ['Entry-level', 'Mid-level', 'Senior', 'Expert'],
    default: 'Entry-level'
  },
  totalExperienceYears: {
    type: Number,
    default: 0
  },
  isCurrent: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
resumeSchema.index({ userId: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
