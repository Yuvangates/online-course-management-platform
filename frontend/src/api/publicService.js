import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/public`;

const publicService = {
  // Get top rated courses (limit: default 3)
  getTopCourses: async (limit = 3) => {
    try {
      const response = await axios.get(`${API_URL}/top-courses`, {
        params: { limit }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching top courses:', error);
      return [];
    }
  },

  // Get top universities by course count (limit: default 3)
  getTopUniversities: async (limit = 3) => {
    try {
      const response = await axios.get(`${API_URL}/top-universities`, {
        params: { limit }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching top universities:', error);
      return [];
    }
  },

  // Get all public courses
  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  },

  // Get all universities
  getAllUniversities: async () => {
    try {
      const response = await axios.get(`${API_URL}/universities`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
  },
};

export default publicService;
