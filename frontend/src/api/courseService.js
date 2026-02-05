import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single course by ID
  getCourseById: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course with modules and content
  getCourseDetails: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search courses
  searchCourses: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/courses/search`, {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Enroll in course
  enrollCourse: async (courseId) => {
    try {
      const response = await axios.post(`${API_URL}/student/enroll`, { course_id: courseId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get enrolled courses for student
  getEnrolledCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/student/enrollments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course modules
  getCourseModules: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}/modules`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get module content
  getModuleContent: async (moduleId) => {
    try {
      const response = await axios.get(`${API_URL}/modules/${moduleId}/content`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default courseService;
