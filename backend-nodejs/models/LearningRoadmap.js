const mongoose = require('mongoose');

const LearningRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skillGapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillGap'
  },
  targetRole: String,
  targetIndustry: String,
  steps: [
    {
      step_number: Number,
      title: String,
      description: String,
      skills: [String],
      duration_weeks: Number,
      resources: [
        {
          type: String,
          title: String,
          url: String,
          duration: String
        }
      ],
      milestones: [String],
      difficulty: String
    }
  ],
  totalDuration: String,
  difficulty_level: String,
  learningStyle: String,
  roadmap_html: String,
  generatedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

LearningRoadmapSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('LearningRoadmap', LearningRoadmapSchema);
