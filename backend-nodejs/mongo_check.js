const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: 'c:/Users/sahil salap/Desktop/Gap2Grow-main/Gap2Grow-main/backend-nodejs/.env' });

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- Connected to MongoDB ---');

    const User = require('./models/User.js');
    const SkillGap = require('./models/SkillGap.js');

    const allGaps = await SkillGap.find().lean();
    console.log(`Found ${allGaps.length} Skill Gaps in total.`);

    for (let gap of allGaps) {
      console.log(`\nGap ID: ${gap._id}`);
      console.log(`  User ID: ${gap.userId}`);
      console.log(`  Target Role: ${gap.targetRole}`);
      console.log(`  isLatest: ${gap.isLatest}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkDB();
