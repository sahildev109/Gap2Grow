const mongoose = require('mongoose');

const jobMarketSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  industry: {
    type: String,
    required: true
  },
  jobOpenings: {
    global: Number,
    usa: Number,
    europe: Number,
    asia: Number
  },
  growthRate: {
    type: Number,
    default: 0 // percentage
  },
  salaryRange: {
    min: Number,
    max: Number,
    average: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  requiredSkills: [{
    skillName: String,
    frequency: Number, // percentage
    salaryImpact: Number // salary increase percentage
  }],
  trendingSkills: [{
    skillName: String,
    trendScore: Number, // 1-10 scale
    demandGrowth: Number // percentage
  }],
  experienceRequirement: {
    min: Number,
    max: Number
  },
  requiredEducation: [String],
  topCompanies: [String],
  topCountriesByDemand: [String],
  careerPath: [{
    roleProgression: String,
    averageYearsToProgress: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
jobMarketSchema.index({ role: 1, industry: 1 });

module.exports = mongoose.model('JobMarket', jobMarketSchema);
