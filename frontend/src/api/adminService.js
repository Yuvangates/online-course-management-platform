import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

const adminService = {
    // Dashboard
    getDashboard: async () => {
        const response = await axios.get(`${API_URL}/dashboard`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // COURSE MANAGEMENT
    // ==========================================

    createCourse: async (courseData) => {
        const response = await axios.post(`${API_URL}/courses`, courseData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllCourses: async () => {
        const response = await axios.get(`${API_URL}/courses`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getCourseDetails: async (courseId) => {
        const response = await axios.get(`${API_URL}/courses/${courseId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateCourse: async (courseId, courseData) => {
        const response = await axios.put(`${API_URL}/courses/${courseId}`, courseData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // INSTRUCTOR MANAGEMENT
    // ==========================================

    createInstructor: async (instructorData) => {
        const response = await axios.post(`${API_URL}/instructors`, instructorData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllInstructors: async () => {
        const response = await axios.get(`${API_URL}/instructors`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    searchInstructors: async (query) => {
        const response = await axios.get(`${API_URL}/instructors/search`, {
            params: { q: query },
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // COURSE-INSTRUCTOR ASSIGNMENT
    // ==========================================

    assignInstructorToCourse: async (courseId, instructorId) => {
        const response = await axios.post(`${API_URL}/courses/assign-instructor`, {
            courseId,
            instructorId
        }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    removeInstructorFromCourse: async (courseId, instructorId) => {
        const response = await axios.delete(`${API_URL}/courses/${courseId}/instructors/${instructorId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // STUDENT MANAGEMENT
    // ==========================================

    getStudentsByCourse: async (courseId) => {
        const response = await axios.get(`${API_URL}/courses/${courseId}/students`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    searchStudents: async (query) => {
        const response = await axios.get(`${API_URL}/students/search`, {
            params: { q: query },
            headers: getAuthHeader()
        });
        return response.data;
    },

    removeStudentFromCourse: async (enrollmentId) => {
        const response = await axios.delete(`${API_URL}/enrollments/${enrollmentId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // ANALYST MANAGEMENT
    // ==========================================

    createAnalyst: async (analystData) => {
        const response = await axios.post(`${API_URL}/analyst`, analystData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAnalyst: async () => {
        const response = await axios.get(`${API_URL}/analyst`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAvailableAnalysts: async () => {
        const response = await axios.get(`${API_URL}/analysts/available`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    assignExistingAnalyst: async (payload) => {
        const response = await axios.post(`${API_URL}/analyst/assign`, payload, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // UNIVERSITIES
    // ==========================================

    getAllUniversities: async () => {
        const response = await axios.get(`${API_URL}/universities`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // USER MANAGEMENT
    // ==========================================

    getAllUsers: async () => {
        const response = await axios.get(`${API_URL}/users`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    searchUsers: async (query) => {
        const response = await axios.get(`${API_URL}/users/search`, {
            params: { q: query },
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await axios.delete(`${API_URL}/users/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // UNIVERSITY MANAGEMENT
    // ==========================================

    getAllUniversities: async () => {
        const response = await axios.get(`${API_URL}/universities`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createUniversity: async (universityData) => {
        const response = await axios.post(`${API_URL}/universities`, universityData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateUniversity: async (universityId, universityData) => {
        const response = await axios.put(`${API_URL}/universities/${universityId}`, universityData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteUniversity: async (universityId) => {
        const response = await axios.delete(`${API_URL}/universities/${universityId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // ==========================================
    // TEXTBOOK MANAGEMENT
    // ==========================================

    getAllTextbooks: async () => {
        const response = await axios.get(`${API_URL}/textbooks`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createTextbook: async (textbookData) => {
        const response = await axios.post(`${API_URL}/textbooks`, textbookData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateTextbook: async (isbn, textbookData) => {
        const response = await axios.put(`${API_URL}/textbooks/${isbn}`, textbookData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteTextbook: async (isbn) => {
        const response = await axios.delete(`${API_URL}/textbooks/${isbn}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },
};

export default adminService;
