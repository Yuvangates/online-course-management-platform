import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const authService = {
    register: async (email, password, name, role, country, additionalData) => {
        const response = await axiosInstance.post('/auth/register', {
            email,
            password,
            name,
            role,
            country,
            date_of_birth: additionalData.date_of_birth,
            skill_level: additionalData.skill_level,
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', { email, password });
        return response.data;
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getProfile: async () => {
        const response = await axiosInstance.get('/auth/profile');
        return response.data;
    },
    updateProfile: async (payload) => {
        const response = await axiosInstance.put('/student/profile', payload);
        return response.data;
    },
};

export default authService;
