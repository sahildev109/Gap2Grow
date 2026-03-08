const CareerReport = require('../models/CareerReport');
const LearningRoadmap = require('../models/LearningRoadmap');
const SkillGap = require('../models/SkillGap');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI Career Report using Gemini
const generateCareerReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { skillGapId } = req.body;

    // Fetch user and skill gap data
    const user = await User.findById(userId);
    const skillGap = await SkillGap.findById(skillGapId || (await SkillGap.findOne({ userId, isLatest: true })._id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!skillGap) {
      return res.status(404).json({ error: 'No skill gap analysis found. Please create one first.' });
    }

    // Prepare context for Gemini
    const prompt = `You are a professional career counselor and AI career advisor. Generate a detailed career report for the following person:

User Profile:
- Name: ${user.firstName} ${user.lastName}
- Current Role: ${user.currentRole || 'Not specified'}
- Target Role: ${skillGap.targetRole}
- Industry: ${skillGap.targetIndustry || 'Not specified'}
- Years of Experience: ${user.yearsOfExperience || 0}
- Current Skills: ${skillGap.currentSkills.map(s => s).join(', ')}
- Required Skills for Target Role: ${skillGap.requiredSkills.map(s => s.name).join(', ')}
- Match Percentage: ${skillGap.matchPercentage}%

Please provide a comprehensive career report in JSON format with the following fields:
{
  "trajectory": "A brief career trajectory description",
  "careerPath": "Detailed career path from current role to target role",
  "expectedGrowth": "Expected career growth opportunities",
  "salaryProgression": {
    "currentLevel": {
      "role": "current role",
      "salary": "estimated salary range"
    },
    "targetLevel": {
      "role": "${skillGap.targetRole}",
      "salary": "estimated salary range for target role"
    },
    "timeline": "estimated timeline to reach target role salary"
  },
  "keyMilestones": ["milestone 1", "milestone 2", "milestone 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "riskFactors": ["risk 1", "risk 2"],
  "opportunities": ["opportunity 1", "opportunity 2"]
}

Make sure the response is valid JSON that can be parsed.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse Gemini response' });
    }

    const reportData = JSON.parse(jsonMatch[0]);

    // Save to database
    const careerReport = new CareerReport({
      userId,
      skillGapId,
      targetRole: skillGap.targetRole,
      trajectory: reportData.trajectory,
      careerPath: reportData.careerPath,
      expectedGrowth: reportData.expectedGrowth,
      salaryProgression: reportData.salaryProgression,
      keyMilestones: reportData.keyMilestones,
      recommendations: reportData.recommendations,
      riskFactors: reportData.riskFactors,
      opportunities: reportData.opportunities
    });

    await careerReport.save();

    res.json({
      success: true,
      report: careerReport,
      message: 'Career report generated successfully'
    });
  } catch (error) {
    console.error('Error generating career report:', error);
    res.status(500).json({ error: error.message || 'Failed to generate career report' });
  }
};

// Get latest career report
const getLatestCareerReport = async (req, res) => {
  try {
    const userId = req.user.userId;

    const report = await CareerReport.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('skillGapId');

    if (!report) {
      return res.status(404).json({ 
        message: 'No career report found. Generate one to get started.' 
      });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching career report:', error);
    res.status(500).json({ error: 'Failed to fetch career report' });
  }
};

// Generate Learning Roadmap using Gemini
const generateLearningRoadmap = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { skillGapId } = req.body;

    // Fetch user and skill gap data
    const user = await User.findById(userId);
    const skillGap = await SkillGap.findById(skillGapId || (await SkillGap.findOne({ userId, isLatest: true })._id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!skillGap) {
      return res.status(404).json({ error: 'No skill gap analysis found. Please create one first.' });
    }

    // Prepare context for Gemini
    const prompt = `You are an expert learning pathway designer. Create a detailed learning roadmap for the following person to reach their target role.

User Profile:
- Name: ${user.firstName} ${user.lastName}
- Current Role: ${user.currentRole || 'Not specified'}
- Target Role: ${skillGap.targetRole}
- Industry: ${skillGap.targetIndustry || 'Not specified'}
- Years of Experience: ${user.yearsOfExperience || 0}
- Learning Style: ${user.preferredLearningStyle || 'Mixed'}
- Skills to Develop: ${skillGap.topPrioritySkills.map(s => s).join(', ')}
- Estimated Time Available: ${skillGap.estimatedTimeToComplete} weeks

Please provide a comprehensive learning roadmap in JSON format with the following structure:
{
  "steps": [
    {
      "step_number": 1,
      "title": "Step title",
      "description": "Detailed description of what to learn",
      "skills": ["skill1", "skill2"],
      "duration_weeks": 4,
      "resources": [
        {
          "type": "course|book|project|certification",
          "title": "Resource title",
          "url": "https://example.com",
          "duration": "4 weeks"
        }
      ],
      "milestones": ["milestone 1", "milestone 2"],
      "difficulty": "Beginner|Intermediate|Advanced"
    }
  ],
  "totalDuration": "total timeline",
  "difficulty_level": "Beginner|Intermediate|Advanced",
  "learningStyle": "recommended learning approach"
}

Create 5-7 steps with realistic timelines and quality resources. Make sure the response is valid JSON.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse Gemini response' });
    }

    const roadmapData = JSON.parse(jsonMatch[0]);

    // Save to database
    const roadmap = new LearningRoadmap({
      userId,
      skillGapId,
      targetRole: skillGap.targetRole,
      targetIndustry: skillGap.targetIndustry,
      steps: roadmapData.steps,
      totalDuration: roadmapData.totalDuration,
      difficulty_level: roadmapData.difficulty_level,
      learningStyle: roadmapData.learningStyle
    });

    await roadmap.save();

    res.json({
      success: true,
      roadmap: roadmap,
      message: 'Learning roadmap generated successfully'
    });
  } catch (error) {
    console.error('Error generating learning roadmap:', error);
    res.status(500).json({ error: error.message || 'Failed to generate learning roadmap' });
  }
};

// Get latest learning roadmap
const getLatestLearningRoadmap = async (req, res) => {
  try {
    const userId = req.user.userId;

    const roadmap = await LearningRoadmap.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('skillGapId');

    if (!roadmap) {
      return res.status(404).json({ 
        message: 'No learning roadmap found. Generate one to get started.' 
      });
    }

    res.json(roadmap);
  } catch (error) {
    console.error('Error fetching learning roadmap:', error);
    res.status(500).json({ error: 'Failed to fetch learning roadmap' });
  }
};

module.exports = {
  generateCareerReport,
  getLatestCareerReport,
  generateLearningRoadmap,
  getLatestLearningRoadmap
};
