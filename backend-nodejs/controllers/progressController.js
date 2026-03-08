const UserProgress = require('../models/UserProgress');

// Get user progress
exports.getUserProgress = async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user.userId });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user.userId,
        skillProgress: [],
        completedResources: [],
        projects: [],
        badges: [],
        achievements: [],
        learningStreak: { current: 0, longest: 0 },
        totalHoursLearned: 0,
        averageHoursPerWeek: 0
      });

      await progress.save();
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update skill progress
exports.updateSkillProgress = async (req, res) => {
  try {
    const { skillName, startLevel, currentLevel, targetLevel, progress } = req.body;

    let userProgress = await UserProgress.findOne({ userId: req.user.userId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user.userId });
    }

    const skillIndex = userProgress.skillProgress.findIndex(s => s.skillName === skillName);

    if (skillIndex >= 0) {
      userProgress.skillProgress[skillIndex] = {
        skillName,
        startLevel,
        currentLevel: currentLevel || userProgress.skillProgress[skillIndex].currentLevel,
        targetLevel,
        progress: progress || userProgress.skillProgress[skillIndex].progress,
        startDate: userProgress.skillProgress[skillIndex].startDate,
        lastUpdated: new Date()
      };
    } else {
      userProgress.skillProgress.push({
        skillName,
        startLevel,
        currentLevel,
        targetLevel,
        progress: progress || 0,
        startDate: new Date(),
        lastUpdated: new Date()
      });
    }

    userProgress.updatedAt = new Date();
    await userProgress.save();

    res.status(200).json({
      message: 'Skill progress updated successfully',
      progress: userProgress
    });
  } catch (err) {
    console.error('Update skill progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add completed resource
exports.addCompletedResource = async (req, res) => {
  try {
    const { resourceTitle, resourceType, duration, rating, notes } = req.body;

    let userProgress = await UserProgress.findOne({ userId: req.user.userId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user.userId });
    }

    userProgress.completedResources.push({
      resourceTitle,
      resourceType: resourceType || 'Course',
      completedDate: new Date(),
      duration: duration || 0,
      rating: rating || 0,
      notes: notes || ''
    });

    userProgress.totalHoursLearned += duration || 0;
    userProgress.updatedAt = new Date();

    await userProgress.save();

    res.status(200).json({
      message: 'Resource marked as completed',
      progress: userProgress
    });
  } catch (err) {
    console.error('Add completed resource error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add project
exports.addProject = async (req, res) => {
  try {
    const { projectTitle, projectDescription, difficulty, portfolio_link } = req.body;

    let userProgress = await UserProgress.findOne({ userId: req.user.userId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user.userId });
    }

    userProgress.projects.push({
      projectTitle,
      projectDescription,
      status: 'Completed',
      completedDate: new Date(),
      portfolio_link: portfolio_link || '',
      difficulty: difficulty || 'Medium'
    });

    userProgress.updatedAt = new Date();
    await userProgress.save();

    res.status(200).json({
      message: 'Project added successfully',
      progress: userProgress
    });
  } catch (err) {
    console.error('Add project error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add badge
exports.addBadge = async (req, res) => {
  try {
    const { badgeName, description, icon } = req.body;

    let userProgress = await UserProgress.findOne({ userId: req.user.userId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user.userId });
    }

    userProgress.badges.push({
      badgeName,
      description,
      earnedDate: new Date(),
      icon: icon || ''
    });

    userProgress.updatedAt = new Date();
    await userProgress.save();

    res.status(200).json({
      message: 'Badge added successfully',
      progress: userProgress
    });
  } catch (err) {
    console.error('Add badge error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update learning streak
exports.updateLearningStreak = async (req, res) => {
  try {
    const { streakDays } = req.body;

    let userProgress = await UserProgress.findOne({ userId: req.user.userId });

    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user.userId });
    }

    if (streakDays) {
      userProgress.learningStreak.current = streakDays;
      if (streakDays > userProgress.learningStreak.longest) {
        userProgress.learningStreak.longest = streakDays;
      }
      userProgress.learningStreak.lastActiveDate = new Date();
    }

    userProgress.updatedAt = new Date();
    await userProgress.save();

    res.status(200).json({
      message: 'Learning streak updated',
      progress: userProgress
    });
  } catch (err) {
    console.error('Update streak error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get progress statistics
exports.getProgressStats = async (req, res) => {
  try {
    const userProgress = await UserProgress.findOne({ userId: req.user.userId });

    if (!userProgress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    const stats = {
      totalHoursLearned: userProgress.totalHoursLearned,
      resourcesCompleted: userProgress.completedResources.length,
      projectsCompleted: userProgress.projects.length,
      skillsProgressed: userProgress.skillProgress.length,
      badgesEarned: userProgress.badges.length,
      achievementsEarned: userProgress.achievements.length,
      currentStreak: userProgress.learningStreak.current,
      longestStreak: userProgress.learningStreak.longest,
      averageHoursPerWeek: userProgress.averageHoursPerWeek
    };

    res.status(200).json(stats);
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
