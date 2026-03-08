const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillGapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillGap'
  },
  pathName: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  milestones: [{
    milestoneId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    skillsCovered: [String],
    estimatedWeeks: Number,
    resources: [{
      type: String, // course, tutorial, project, book
      title: String,
      url: String,
      duration: Number, // in hours
      difficulty: String
    }],
    assessments: [{
      title: String,
      type: String,
      deadline: String
    }],
    projects: [{
      title: String,
      description: String,
      difficulty: String
    }],
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedDate: Date,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  totalMilestones: {
    type: Number,
    default: 0
  },
  completedMilestones: {
    type: Number,
    default: 0
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  pathStatus: {
    type: String,
    enum: ['Active', 'Paused', 'Completed'],
    default: 'Active'
  },
  intensityLevel: {
    type: String,
    enum: ['Light', 'Moderate', 'Intensive'],
    default: 'Moderate'
  },
  preferredLearningStyle: {
    type: String,
    enum: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'],
    default: 'Visual'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  estimatedEndDate: Date,
  completedDate: Date,
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
learningPathSchema.index({ userId: 1 });

module.exports = mongoose.model('LearningPath', learningPathSchema);
