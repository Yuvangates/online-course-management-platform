const express = require('express');
const router = express.Router();
const analystController = require('../controllers/analystController');

// ==========================================
// DASHBOARD & KPIs
// ==========================================

// GET /api/analyst/dashboard - Get main dashboard with all KPIs
router.get('/dashboard', analystController.getDashboard);

// ==========================================
// REVENUE ANALYTICS
// ==========================================

// GET /api/analyst/revenue/total - Get total revenue
router.get('/revenue/total', analystController.getTotalRevenue);

// GET /api/analyst/revenue/university - Get revenue by university
router.get('/revenue/university', analystController.getRevenueByUniversity);

// GET /api/analyst/revenue/free-vs-paid - Get free vs paid course stats
router.get('/revenue/free-vs-paid', analystController.getFreeVsPaidStats);

// ==========================================
// ENGAGEMENT ANALYTICS
// ==========================================

// GET /api/analyst/engagement/user-status - Get dormant vs active users
router.get('/engagement/user-status', analystController.getUserStatus);

// GET /api/analyst/engagement/dropoff - Get content dropoff rate
router.get('/engagement/dropoff', analystController.getContentDropoff);

// GET /api/analyst/engagement/learning-mode - Get preferred learning mode
router.get('/engagement/learning-mode', analystController.getLearningMode);

// ==========================================
// PERFORMANCE ANALYTICS
// ==========================================

// GET /api/analyst/performance/scores - Get score distribution
router.get('/performance/scores', analystController.getScoreDistribution);

// GET /api/analyst/performance/skill-analysis - Get skill level vs success
router.get('/performance/skill-analysis', analystController.getSkillAnalysis);

// ==========================================
// INSTRUCTOR ANALYTICS
// ==========================================

// GET /api/analyst/instructor/leaderboard - Get instructor leaderboard
router.get('/instructor/leaderboard', analystController.getInstructorLeaderboard);

// GET /api/analyst/instructor/duration-analysis - Get course duration vs completion
router.get('/instructor/duration-analysis', analystController.getDurationAnalysis);

// ==========================================
// TREND ANALYTICS
// ==========================================

// GET /api/analyst/trends/enrollment - Get enrollment trends
router.get('/trends/enrollment', analystController.getEnrollmentTrends);

module.exports = router;

