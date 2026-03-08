const express = require('express');
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, progressController.getUserProgress);
router.post('/skill-progress', authMiddleware, progressController.updateSkillProgress);
router.post('/completed-resource', authMiddleware, progressController.addCompletedResource);
router.post('/project', authMiddleware, progressController.addProject);
router.post('/badge', authMiddleware, progressController.addBadge);
router.put('/streak', authMiddleware, progressController.updateLearningStreak);
router.get('/stats', authMiddleware, progressController.getProgressStats);

module.exports = router;
