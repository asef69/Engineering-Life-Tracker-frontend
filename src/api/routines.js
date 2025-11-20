import apiClient from './client';

export const routinesAPI = {
  getRoutines: async (level = null, term = null) => {
    const params = {};
    if (level !== null) params.level = level;
    if (term !== null) params.term = term;
    const response = await apiClient.get('/api/routines/', { params });
    return response.data;
  },

  createRoutine: async (formData) => {
    const response = await apiClient.post('/api/routines/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getRoutine: async (id) => {
    const response = await apiClient.get(`/api/routines/${id}/`);
    return response.data;
  },

  updateRoutine: async (id, formData) => {
    const response = await apiClient.put(`/api/routines/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  patchRoutine: async (id, formData) => {
    const response = await apiClient.patch(`/api/routines/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteRoutine: async (id) => {
    const response = await apiClient.delete(`/api/routines/${id}/`);
    return response.data;
  },
};

