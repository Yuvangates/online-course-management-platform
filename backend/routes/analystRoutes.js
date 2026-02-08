const express = require('express');
const router = express.Router();
const analystController = require('../controllers/analystController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');


router.get('/dashboard', verifyToken, checkRole(['Analyst']), analystController.getDashboard);

router.get('/revenue/total', verifyToken, checkRole(['Analyst']), analystController.getTotalRevenue);

router.get('/revenue/university', verifyToken, checkRole(['Analyst']), analystController.getRevenueByUniversity);

router.get('/revenue/free-vs-paid', verifyToken, checkRole(['Analyst']), analystController.getFreeVsPaidStats);

router.get('/engagement/user-status', verifyToken, checkRole(['Analyst']), analystController.getUserStatus);

router.get('/engagement/dropoff', verifyToken, checkRole(['Analyst']), analystController.getContentDropoff);

router.get('/engagement/learning-mode', verifyToken, checkRole(['Analyst']), analystController.getLearningMode);

router.get('/performance/scores', verifyToken, checkRole(['Analyst']), analystController.getScoreDistribution);

router.get('/performance/skill-analysis', verifyToken, checkRole(['Analyst']), analystController.getSkillAnalysis);

router.get('/instructor/leaderboard', verifyToken, checkRole(['Analyst']), analystController.getInstructorLeaderboard);
router.get('/instructor/duration-analysis', verifyToken, checkRole(['Analyst']), analystController.getDurationAnalysis);

router.get('/trends/enrollment', verifyToken, checkRole(['Analyst']), analystController.getEnrollmentTrends);

module.exports = router;

