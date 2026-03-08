const mongoose = require('mongoose');

const CareerReportSchema = new mongoose.Schema({
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
  trajectory: String,
  careerPath: String,
  expectedGrowth: String,
  salaryProgression: {
    currentLevel: {
      role: String,
      salary: String
    },
    targetLevel: {
      role: String,
      salary: String
    },
    timeline: String
  },
  keyMilestones: [String],
  recommendations: [String],
  riskFactors: [String],
  opportunities: [String],
  report_html: String,
  generatedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

CareerReportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CareerReport', CareerReportSchema);
