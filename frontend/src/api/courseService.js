import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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
  getModuleContent: async (courseId, moduleNumber) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}/modules/${moduleNumber}/content`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course universities
  getCourseUniversities: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}/universities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course rating
  getCourseRating: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}/rating`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course reviews
  getCourseReviews: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit a review for a course (student only)
  submitReview: async (courseId, { review, rating }) => {
    try {
      const response = await axios.post(`${API_URL}/student/courses/${courseId}/review`, { review, rating }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark content as complete
  markContentComplete: async (courseId, moduleNumber, contentId) => {
    try {
      const response = await axios.post(`${API_URL}/student/progress/mark-complete`, {
        course_id: courseId,
        module_number: moduleNumber,
        content_id: contentId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get student progress
  getStudentProgress: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/student/progress/${courseId}`, {
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
