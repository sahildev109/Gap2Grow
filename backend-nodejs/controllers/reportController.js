const CareerReport = require('../models/CareerReport');
const LearningRoadmap = require('../models/LearningRoadmap');
const SkillGap = require('../models/SkillGap');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI Career Report using Gemini
const generateCareerReport = async (req, res) => {
  console.log('\n--- [BACKEND: CAREER REPORT] GENERATION STARTED ---');
  try {
    const userId = req.user.userId;
    const { skillGapId } = req.body;
    console.log(`[BACKEND: CAREER REPORT] Request received for user ${userId}, skillGapId: ${skillGapId || 'latest'}`);

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

    console.log(`[BACKEND: CAREER REPORT] Sending prompt to Gemini for target role: ${skillGap.targetRole}...`);
    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    let reportData;
    try {
      console.log(`[BACKEND: CAREER REPORT] Received raw response from Gemini (length: ${responseText.length})`);
      reportData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
      console.log(`[BACKEND: CAREER REPORT] Successfully parsed JSON directly!`);
    } catch (parseError) {
      console.log(`[BACKEND: CAREER REPORT] Direct JSON parse failed, trying regex fallback...`);
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          reportData = JSON.parse(jsonMatch[0]);
          console.log(`[BACKEND: CAREER REPORT] Successfully parsed JSON via regex!`);
        } else {
          throw new Error('No JSON object found in response');
        }
      } catch (fallbackError) {
        console.error('\n[BACKEND: CAREER REPORT] ❌ Failed to parse Gemini response! Raw Text:\n', responseText);
        return res.status(500).json({ error: 'Failed to parse Gemini response as JSON' });
      }
    }

    console.log(`[BACKEND: CAREER REPORT] Saving generated report to MongoDB...`);
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
    console.log(`[BACKEND: CAREER REPORT] ✅ Report successfully saved for user ${userId}! Sending to frontend.`);

    res.json({
      success: true,
      report: careerReport,
      message: 'Career report generated successfully'
    });
  } catch (error) {
    console.error('\n[BACKEND: CAREER REPORT] ❌ Fatal error generating career report:\n', error);
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
      return res.json(null);
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching career report:', error);
    res.status(500).json({ error: 'Failed to fetch career report' });
  }
};

// Generate Learning Roadmap using Gemini
const generateLearningRoadmap = async (req, res) => {
  console.log('\n--- [BACKEND: LEARNING ROADMAP] GENERATION STARTED ---');
  try {
    const userId = req.user.userId;
    const { skillGapId } = req.body;
    console.log(`[BACKEND: LEARNING ROADMAP] Request received for user ${userId}, skillGapId: ${skillGapId || 'latest'}`);

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

    console.log(`[BACKEND: LEARNING ROADMAP] Sending prompt to Gemini for target role: ${skillGap.targetRole}...`);
    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    let roadmapData;
    try {
      console.log(`[BACKEND: LEARNING ROADMAP] Received raw response from Gemini (length: ${responseText.length})`);
      roadmapData = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
      console.log(`[BACKEND: LEARNING ROADMAP] Successfully parsed JSON directly!`);
    } catch (parseError) {
      console.log(`[BACKEND: LEARNING ROADMAP] Direct JSON parse failed, trying regex fallback...`);
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          roadmapData = JSON.parse(jsonMatch[0]);
          console.log(`[BACKEND: LEARNING ROADMAP] Successfully parsed JSON via regex!`);
        } else {
          throw new Error('No JSON object found in response');
        }
      } catch (fallbackError) {
        console.error('\n[BACKEND: LEARNING ROADMAP] ❌ Failed to parse Gemini response! Raw Text:\n', responseText);
        return res.status(500).json({ error: 'Failed to parse Gemini response as JSON' });
      }
    }

    console.log(`[BACKEND: LEARNING ROADMAP] Saving generated roadmap to MongoDB...`);
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
    console.log(`[BACKEND: LEARNING ROADMAP] ✅ Roadmap successfully saved for user ${userId}! Sending to frontend.`);

    res.json({
      success: true,
      roadmap: roadmap,
      message: 'Learning roadmap generated successfully'
    });
  } catch (error) {
    console.error('\n[BACKEND: LEARNING ROADMAP] ❌ Fatal error generating learning roadmap:\n', error);
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
      return res.json(null);
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
