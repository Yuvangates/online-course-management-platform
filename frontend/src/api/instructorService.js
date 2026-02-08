import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const instructorService = {
  getDashboard: async () => {
    const response = await axios.get(`${API_URL}/instructor/dashboard`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getAssignedCourses: async () => {
    const response = await axios.get(`${API_URL}/instructor/courses`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getCourseEnrollments: async (courseId) => {
    const response = await axios.get(`${API_URL}/instructor/courses/${courseId}/enrollments`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateGrade: async (enrollmentId, evaluationScore) => {
    const response = await axios.put(
      `${API_URL}/instructor/enrollments/${enrollmentId}/grade`,
      { evaluation_score: evaluationScore },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getCourseModules: async (courseId) => {
    const response = await axios.get(`${API_URL}/instructor/courses/${courseId}/modules`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  createModule: async (courseId, { module_number, name, duration_weeks }) => {
    const response = await axios.post(
      `${API_URL}/instructor/courses/${courseId}/modules`,
      { module_number, name, duration_weeks },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  updateModule: async (courseId, moduleNumber, { name, duration_weeks }) => {
    const response = await axios.put(
      `${API_URL}/instructor/courses/${courseId}/modules/${moduleNumber}`,
      { name, duration_weeks },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  swapModules: async (courseId, num1, num2) => {
    const response = await axios.post(
      `${API_URL}/instructor/courses/${courseId}/modules/swap`,
      { num1, num2 },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getModuleContent: async (courseId, moduleNumber) => {
    const response = await axios.get(
      `${API_URL}/instructor/courses/${courseId}/modules/${moduleNumber}/content`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  createContent: async (courseId, moduleNumber, { content_id, title, content_type, url }) => {
    const response = await axios.post(
      `${API_URL}/instructor/courses/${courseId}/modules/${moduleNumber}/content`,
      { content_id, title, content_type, url },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  updateContent: async (courseId, moduleNumber, contentId, { title, content_type, url }) => {
    const response = await axios.put(
      `${API_URL}/instructor/courses/${courseId}/modules/${moduleNumber}/content/${contentId}`,
      { title, content_type, url },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};

export default instructorService;
