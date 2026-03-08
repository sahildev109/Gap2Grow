const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  generateCareerReport,
  getLatestCareerReport,
  generateLearningRoadmap,
  getLatestLearningRoadmap
} = require('../controllers/reportController');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Career Report Routes
router.post('/career', generateCareerReport);
router.get('/career', getLatestCareerReport);

// Learning Roadmap Routes
router.post('/roadmap', generateLearningRoadmap);
router.get('/roadmap', getLatestLearningRoadmap);

module.exports = router;
