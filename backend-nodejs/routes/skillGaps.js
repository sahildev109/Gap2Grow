const express = require('express');
const skillGapController = require('../controllers/skillGapController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/latest', authMiddleware, skillGapController.getLatestSkillGap);
router.get('/', authMiddleware, skillGapController.getAllSkillGaps);
router.post('/', authMiddleware, skillGapController.createSkillGap);
router.put('/:skillGapId', authMiddleware, skillGapController.updateSkillGap);

module.exports = router;
