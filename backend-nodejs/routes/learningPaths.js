const express = require('express');
const learningPathController = require('../controllers/learningPathController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, learningPathController.getUserLearningPaths);
router.get('/active', authMiddleware, learningPathController.getActiveLearningPath);
router.post('/', authMiddleware, learningPathController.createLearningPath);
router.put('/:pathId', authMiddleware, learningPathController.updateLearningPath);
router.put('/:pathId/milestones/:milestoneId', authMiddleware, learningPathController.updateMilestone);
router.delete('/:pathId', authMiddleware, learningPathController.deleteLearningPath);

module.exports = router;
