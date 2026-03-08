const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { generateCareerReport, generateLearningRoadmap } = require('./controllers/reportController.js');

dotenv.config({ path: 'c:/Users/sahil salap/Desktop/Gap2Grow-main/Gap2Grow-main/backend-nodejs/.env' });

// Mock express response
const mockRes = {
  json: (data) => console.log('✅ Response:', JSON.stringify(data, null, 2).substring(0, 300) + '...'),
  status: function(code) { 
    console.log(`⚠️ Status Error: ${code}`); 
    return this; 
  }
};

async function checkGeneration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected to MongoDB');

    const User = require('./models/User.js');
    const SkillGap = require('./models/SkillGap.js');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      return;
    }
    
    let skillGap = await SkillGap.findOne({ userId: user._id }).sort({ createdAt: -1 });
    
    // Create a mock skill gap if none exists
    if (!skillGap) {
      console.log('No skill gap found, creating a mock one...');
      skillGap = new SkillGap({
        userId: user._id,
        targetRole: 'Senior React Developer',
        targetIndustry: 'Technology',
        currentSkills: [{ skillName: 'React', proficiency: 'Intermediate', yearsOfExperience: 2 }],
        requiredSkills: [
          { skillName: 'React', importance: 'Critical', frequency: 5, salaryImpact: 20 },
          { skillName: 'Next.js', importance: 'Critical', frequency: 5, salaryImpact: 30 }
        ],
        skillGap: [
          { skillName: 'Next.js', currentLevel: 'Beginner', requiredLevel: 'Advanced', gap: 3, priority: 'Critical', estimatedWeeksToLearn: 4 }
        ],
        matchPercentage: 65,
        overallReadiness: 'Fair',
        topPrioritySkills: [{ skillName: 'Next.js', importance: 'High' }],
        estimatedTimeToComplete: 8
      });
      await skillGap.save();
    }

    console.log(`\n👨‍💻 Generating for User: ${user.firstName} ${user.lastName}`);
    console.log(`🎯 Target Role: ${skillGap.targetRole}`);
    
    // Mock express request
    const req1 = {
      user: { userId: user._id },
      body: { skillGapId: skillGap._id }
    };

    console.log('\n--- 📝 Generating Career Report ---');
    await generateCareerReport(req1, mockRes);
    
    console.log('\n--- 🗺️ Generating Learning Roadmap ---');
    await generateLearningRoadmap(req1, mockRes);

  } catch (error) {
    console.error('❌ Error in verification:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkGeneration();
