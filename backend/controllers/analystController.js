const queries = require('../db/queries');

// ==========================================
// DASHBOARD & KPIs
// ==========================================

// GET /api/analyst/dashboard - Get main dashboard with all KPIs
const getDashboard = async (req, res) => {
    try {
        const kpis = await queries.getAnalystDashboardKPIs();
        res.status(200).json(kpis);
    } catch (error) {
        console.error('Get analyst dashboard error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// REVENUE ANALYTICS
// ==========================================

// GET /api/analyst/revenue/total - Get total revenue
const getTotalRevenue = async (req, res) => {
    try {
        const revenue = await queries.getTotalRevenue();
        res.status(200).json(revenue);
    } catch (error) {
        console.error('Get total revenue error:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyst/revenue/university - Get revenue by university
const getRevenueByUniversity = async (req, res) => {
    try {
        const data = await queries.getRevenueByUniversity();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get revenue by university error:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyst/revenue/free-vs-paid - Get free vs paid course stats
const getFreeVsPaidStats = async (req, res) => {
    try {
        const data = await queries.getFreeVsPaidCourseStats();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get free vs paid stats error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// ENGAGEMENT ANALYTICS
// ==========================================

// GET /api/analyst/engagement/user-status - Get dormant vs active users
const getUserStatus = async (req, res) => {
    try {
        const data = await queries.getDormantVsActiveUsers();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get user status error:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyst/engagement/dropoff - Get content dropoff rate
const getContentDropoff = async (req, res) => {
    try {
        const data = await queries.getContentDropoffRate();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get content dropoff error:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyst/engagement/learning-mode - Get preferred learning mode
const getLearningMode = async (req, res) => {
    try {
        const data = await queries.getPreferredLearningMode();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get learning mode error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// PERFORMANCE ANALYTICS
// ==========================================

// GET /api/analyst/performance/scores - Get score distribution
const getScoreDistribution = async (req, res) => {
    try {
        const data = await queries.getScoreDistribution();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get score distribution error:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyst/performance/skill-analysis - Get skill level vs success
const getSkillAnalysis = async (req, res) => {
    try {
        const data = await queries.getSkillLevelVsSuccess();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get skill analysis error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// INSTRUCTOR ANALYTICS
// ==========================================

// GET /api/analyst/instructor/leaderboard - Get instructor leaderboard
const getInstructorLeaderboard = async (req, res) => {
    try {
        const data = await queries.getInstructorLeaderboard();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get instructor leaderboard error:', error);
        res.status(500).json({ error: error.message });
    }
};

// GET /api/analyst/instructor/duration-analysis - Get course duration vs completion
const getDurationAnalysis = async (req, res) => {
    try {
        const data = await queries.getCourseDurationVsCompletion();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get duration analysis error:', error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// TREND ANALYTICS
// ==========================================

// GET /api/analyst/trends/enrollment - Get enrollment trends
const getEnrollmentTrends = async (req, res) => {
    try {
        const data = await queries.getEnrollmentTrends();
        res.status(200).json(data);
    } catch (error) {
        console.error('Get enrollment trends error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDashboard,
    getTotalRevenue,
    getRevenueByUniversity,
    getFreeVsPaidStats,
    getUserStatus,
    getContentDropoff,
    getLearningMode,
    getScoreDistribution,
    getSkillAnalysis,
    getInstructorLeaderboard,
    getDurationAnalysis,
    getEnrollmentTrends,
};
