const SkillGap = require('../models/SkillGap');
const JobMarket = require('../models/JobMarket');

// Get latest skill gap analysis
exports.getLatestSkillGap = async (req, res) => {
  console.log(`\n--- [BACKEND: SKILL GAP] getLatestSkillGap hit by user ${req.user?.userId} ---`);
  try {
    const skillGap = await SkillGap.findOne(
      { userId: req.user.userId, isLatest: true }
    );

    if (!skillGap) {
      return res.json(null);
    }

    res.status(200).json(skillGap);
  } catch (err) {
    console.error('Get skill gap error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all skill gap analyses
exports.getAllSkillGaps = async (req, res) => {
  try {
    const skillGaps = await SkillGap.find({ userId: req.user.userId })
      .sort({ analysisDate: -1 });

    res.status(200).json({
      count: skillGaps.length,
      skillGaps
    });
  } catch (err) {
    console.error('Get skill gaps error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create skill gap analysis
exports.createSkillGap = async (req, res) => {
  try {
    const {
      targetRole,
      targetIndustry,
      currentSkills,
      requiredSkills
    } = req.body;

    if (!targetRole || !targetIndustry) {
      return res.status(400).json({ error: 'Target role and industry are required' });
    }

    // Mark previous analyses as not latest
    await SkillGap.updateMany(
      { userId: req.user.userId, isLatest: true },
      { isLatest: false }
    );

    // Calculate skill gaps
    const skillGapArray = [];
    let matchedSkills = 0;

    requiredSkills.forEach(required => {
      const current = currentSkills.find(s => s.skillName.toLowerCase() === required.skillName.toLowerCase());
      
      const gap = {
        skillName: required.skillName,
        currentLevel: current ? current.proficiency : 'None',
        requiredLevel: required.importance,
        gap: current ? 50 : 100,
        priority: required.importance,
        estimatedWeeksToLearn: required.importance === 'Critical' ? 8 : required.importance === 'Important' ? 12 : 6
      };

      skillGapArray.push(gap);
      if (current) matchedSkills++;
    });

    const matchPercentage = Math.round((matchedSkills / requiredSkills.length) * 100);

    const readinessMap = {
      0: 'Poor',
      25: 'Fair',
      50: 'Good',
      75: 'Very Good',
      100: 'Excellent'
    };

    let overallReadiness = 'Poor';
    if (matchPercentage >= 75) overallReadiness = 'Excellent';
    else if (matchPercentage >= 50) overallReadiness = 'Very Good';
    else if (matchPercentage >= 35) overallReadiness = 'Good';
    else if (matchPercentage >= 15) overallReadiness = 'Fair';

    const topPrioritySkills = skillGapArray
      .filter(s => s.priority === 'Critical')
      .slice(0, 5)
      .map(s => ({ skillName: s.skillName, importance: s.priority }));

    const totalEstimatedWeeks = skillGapArray.reduce((sum, s) => sum + s.estimatedWeeksToLearn, 0);

    const skillGap = new SkillGap({
      userId: req.user.userId,
      targetRole,
      targetIndustry,
      currentSkills,
      requiredSkills,
      skillGap: skillGapArray,
      matchPercentage,
      overallReadiness,
      topPrioritySkills,
      estimatedTimeToComplete: totalEstimatedWeeks,
      isLatest: true
    });

    await skillGap.save();

    res.status(201).json({
      message: 'Skill gap analysis created successfully',
      skillGap
    });
  } catch (err) {
    console.error('Create skill gap error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update skill gap
exports.updateSkillGap = async (req, res) => {
  try {
    const { skillGapId } = req.params;
    const updateData = req.body;

    const skillGap = await SkillGap.findById(skillGapId);

    if (!skillGap || skillGap.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Skill gap not found' });
    }

    Object.assign(skillGap, updateData);
    skillGap.updatedAt = new Date();

    await skillGap.save();

    res.status(200).json({
      message: 'Skill gap updated successfully',
      skillGap
    });
  } catch (err) {
    console.error('Update skill gap error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
