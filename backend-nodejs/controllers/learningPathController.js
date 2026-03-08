const LearningPath = require('../models/LearningPath');

// Get user's learning paths
exports.getUserLearningPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find({ userId: req.user.userId })
      .sort({ startDate: -1 });

    res.status(200).json({
      count: paths.length,
      paths
    });
  } catch (err) {
    console.error('Get learning paths error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get active learning path
exports.getActiveLearningPath = async (req, res) => {
  try {
    const path = await LearningPath.findOne(
      { userId: req.user.userId, pathStatus: 'Active' }
    );

    if (!path) {
      return res.status(404).json({ error: 'No active learning path found' });
    }

    res.status(200).json(path);
  } catch (err) {
    console.error('Get active path error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create learning path
exports.createLearningPath = async (req, res) => {
  try {
    const {
      pathName,
      targetRole,
      description,
      milestones,
      intensityLevel,
      preferredLearningStyle
    } = req.body;

    if (!pathName || !targetRole) {
      return res.status(400).json({ error: 'Path name and target role are required' });
    }

    const path = new LearningPath({
      userId: req.user.userId,
      pathName,
      targetRole,
      description,
      milestones: milestones || [],
      totalMilestones: milestones ? milestones.length : 0,
      intensityLevel: intensityLevel || 'Moderate',
      preferredLearningStyle: preferredLearningStyle || 'Visual',
      pathStatus: 'Active'
    });

    await path.save();

    res.status(201).json({
      message: 'Learning path created successfully',
      path
    });
  } catch (err) {
    console.error('Create learning path error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update learning path
exports.updateLearningPath = async (req, res) => {
  try {
    const { pathId } = req.params;
    const updateData = req.body;

    const path = await LearningPath.findById(pathId);

    if (!path || path.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    Object.assign(path, updateData);
    path.updatedAt = new Date();

    await path.save();

    res.status(200).json({
      message: 'Learning path updated successfully',
      path
    });
  } catch (err) {
    console.error('Update learning path error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update milestone
exports.updateMilestone = async (req, res) => {
  try {
    const { pathId, milestoneId } = req.params;
    const updateData = req.body;

    const path = await LearningPath.findById(pathId);

    if (!path || path.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    const milestone = path.milestones.find(m => m.milestoneId.toString() === milestoneId);

    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    Object.assign(milestone, updateData);

    if (updateData.isCompleted && !milestone.completedDate) {
      milestone.completedDate = new Date();
      path.completedMilestones = (path.completedMilestones || 0) + 1;
    }

    // Calculate overall progress
    const totalMilestones = path.milestones.length;
    const completedMilestones = path.milestones.filter(m => m.isCompleted).length;
    path.overallProgress = Math.round((completedMilestones / totalMilestones) * 100);

    path.updatedAt = new Date();
    await path.save();

    res.status(200).json({
      message: 'Milestone updated successfully',
      path
    });
  } catch (err) {
    console.error('Update milestone error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete learning path
exports.deleteLearningPath = async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.pathId);

    if (!path || path.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    await LearningPath.findByIdAndDelete(req.params.pathId);

    res.status(200).json({ message: 'Learning path deleted successfully' });
  } catch (err) {
    console.error('Delete learning path error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
