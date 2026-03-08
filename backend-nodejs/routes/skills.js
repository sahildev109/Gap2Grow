const express = require('express');
const skillController = require('../controllers/skillController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, skillController.getUserSkills);
router.get('/search', authMiddleware, skillController.searchSkills);
router.get('/:skillId', authMiddleware, skillController.getSkillById);
router.post('/', authMiddleware, skillController.createSkill);
router.put('/:skillId', authMiddleware, skillController.updateSkill);
router.delete('/:skillId', authMiddleware, skillController.deleteSkill);

module.exports = router;
