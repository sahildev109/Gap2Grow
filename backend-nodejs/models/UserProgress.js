const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learningPathId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath'
  },
  skillProgress: [{
    skillName: String,
    startLevel: String,
    currentLevel: String,
    targetLevel: String,
    progress: Number, // percentage
    startDate: Date,
    lastUpdated: Date
  }],
  completedResources: [{
    resourceTitle: String,
    resourceType: String,
    completedDate: Date,
    duration: Number, // in hours
    rating: Number, // 1-5
    notes: String
  }],
  projects: [{
    projectTitle: String,
    projectDescription: String,
    status: String,
    completedDate: Date,
    portfolio_link: String,
    difficulty: String
  }],
  badges: [{
    badgeName: String,
    description: String,
    earnedDate: Date,
    icon: String
  }],
  achievements: [{
    title: String,
    description: String,
    earnedDate: Date,
    type: String
  }],
  learningStreak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActiveDate: Date
  },
  totalHoursLearned: {
    type: Number,
    default: 0
  },
  averageHoursPerWeek: {
    type: Number,
    default: 0
  },
  weeklySessions: [{
    week: String,
    hoursSpent: Number,
    resourcesCompleted: Number,
    date: Date
  }],
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
userProgressSchema.index({ userId: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
