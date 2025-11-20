import apiClient from './client';

export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/api/users/register/', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/api/users/login/', {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/api/users/me/');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put('/api/users/me/', userData);
    return response.data;
  },

  patchProfile: async (userData) => {
    const response = await apiClient.patch('/api/users/me/', userData);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword, confirmNewPassword) => {
    const response = await apiClient.post('/api/users/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    });
    return response.data;
  },
};

