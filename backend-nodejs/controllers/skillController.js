const Skill = require('../models/Skill');

// Get all skills for user
exports.getUserSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: skills.length,
      skills
    });
  } catch (err) {
    console.error('Get skills error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single skill
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);

    if (!skill || skill.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.status(200).json(skill);
  } catch (err) {
    console.error('Get skill error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new skill
exports.createSkill = async (req, res) => {
  try {
    const { skillName, proficiencyLevel, yearsOfExperience } = req.body;

    if (!skillName) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const skill = new Skill({
      userId: req.user.userId,
      skillName,
      proficiencyLevel: proficiencyLevel || 'Beginner',
      yearsOfExperience: yearsOfExperience || 0
    });

    await skill.save();

    res.status(201).json({
      message: 'Skill created successfully',
      skill
    });
  } catch (err) {
    console.error('Create skill error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update skill
exports.updateSkill = async (req, res) => {
  try {
    const { skillName, proficiencyLevel, yearsOfExperience, endorsements, relevanceScore } = req.body;

    const skill = await Skill.findById(req.params.skillId);

    if (!skill || skill.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skillName) skill.skillName = skillName;
    if (proficiencyLevel) skill.proficiencyLevel = proficiencyLevel;
    if (yearsOfExperience !== undefined) skill.yearsOfExperience = yearsOfExperience;
    if (endorsements !== undefined) skill.endorsements = endorsements;
    if (relevanceScore !== undefined) skill.relevanceScore = relevanceScore;
    skill.lastUpdated = new Date();

    await skill.save();

    res.status(200).json({
      message: 'Skill updated successfully',
      skill
    });
  } catch (err) {
    console.error('Update skill error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.skillId);

    if (!skill || skill.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(req.params.skillId);

    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Delete skill error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search skills
exports.searchSkills = async (req, res) => {
  try {
    const { q, proficiency } = req.query;
    
    let query = { userId: req.user.userId };
    
    if (q) {
      query.skillName = { $regex: q, $options: 'i' };
    }
    
    if (proficiency) {
      query.proficiencyLevel = proficiency;
    }

    const skills = await Skill.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      count: skills.length,
      skills
    });
  } catch (err) {
    console.error('Search skills error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
