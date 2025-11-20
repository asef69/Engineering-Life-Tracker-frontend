import apiClient from './client';

export const coursesAPI = {
  getCourses: async (level = null, term = null) => {
    const params = {};
    if (level !== null) params.level = level;
    if (term !== null) params.term = term;
    const response = await apiClient.get('/api/courses/', { params });
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await apiClient.post('/api/courses/', courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await apiClient.put(`/api/courses/${courseId}/`, courseData);
    return response.data;
  },

  patchCourse: async (courseId, courseData) => {
    const response = await apiClient.patch(`/api/courses/${courseId}/`, courseData);
    return response.data;
  },

  getCGPASummary: async (level = null, term = null) => {
    const params = {};
    if (level !== null) params.level = level;
    if (term !== null) params.term = term;
    const response = await apiClient.get('/api/courses/cgpa-summary/', { params });
    return response.data;
  },
};

