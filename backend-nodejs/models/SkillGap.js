const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  targetRole: {
    type: String,
    required: true
  },
  targetIndustry: {
    type: String,
    required: true
  },
  currentSkills: [{
    skillName: String,
    proficiency: String,
    yearsOfExperience: Number
  }],
  requiredSkills: [{
    skillName: String,
    importance: {
      type: String,
      enum: ['Critical', 'Important', 'Nice-to-have']
    },
    frequency: Number,
    salaryImpact: Number
  }],
  skillGap: [{
    skillName: String,
    currentLevel: String,
    requiredLevel: String,
    gap: Number,
    priority: {
      type: String,
      enum: ['Critical', 'Important', 'Nice-to-have']
    },
    estimatedWeeksToLearn: Number
  }],
  matchPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  overallReadiness: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    default: 'Fair'
  },
  topPrioritySkills: [{
    skillName: String,
    importance: String
  }],
  estimatedTimeToComplete: {
    type: Number, // in weeks
    default: 0
  },
  analysisDate: {
    type: Date,
    default: Date.now
  },
  isLatest: {
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
skillGapSchema.index({ userId: 1 });
skillGapSchema.index({ userId: 1, isLatest: 1 });

module.exports = mongoose.model('SkillGap', skillGapSchema);
