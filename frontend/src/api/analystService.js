import axios from 'axios';

const API_URL = 'https://online-course-management-platform-9swy.onrender.com/api/analyst';

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

const analystService = {
    // ==========================================
    // DASHBOARD & KPIs
    // ==========================================

    getDashboard: async () => {
        const response = await axios.get(`${API_URL}/dashboard`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // REVENUE ANALYTICS
    // ==========================================

    getTotalRevenue: async () => {
        const response = await axios.get(`${API_URL}/revenue/total`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getRevenueByUniversity: async () => {
        const response = await axios.get(`${API_URL}/revenue/university`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getFreeVsPaidStats: async () => {
        const response = await axios.get(`${API_URL}/revenue/free-vs-paid`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // ENGAGEMENT ANALYTICS
    // ==========================================

    getUserStatus: async () => {
        const response = await axios.get(`${API_URL}/engagement/user-status`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getContentDropoff: async () => {
        const response = await axios.get(`${API_URL}/engagement/dropoff`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getLearningMode: async () => {
        const response = await axios.get(`${API_URL}/engagement/learning-mode`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // PERFORMANCE ANALYTICS
    // ==========================================

    getScoreDistribution: async () => {
        const response = await axios.get(`${API_URL}/performance/scores`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getSkillAnalysis: async () => {
        const response = await axios.get(`${API_URL}/performance/skill-analysis`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // INSTRUCTOR ANALYTICS
    // ==========================================

    getInstructorLeaderboard: async () => {
        const response = await axios.get(`${API_URL}/instructor/leaderboard`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getDurationAnalysis: async () => {
        const response = await axios.get(`${API_URL}/instructor/duration-analysis`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // TREND ANALYTICS
    // ==========================================

    getEnrollmentTrends: async () => {
        const response = await axios.get(`${API_URL}/trends/enrollment`, {
            headers: getAuthHeader()
        });
        return response.data;
    },
};

export default analystService;
