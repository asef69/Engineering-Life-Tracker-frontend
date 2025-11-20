import apiClient from './client';

export const todosAPI = {
  getTodos: async () => {
    const response = await apiClient.get('/api/todos/');
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await apiClient.post('/api/todos/', todoData);
    return response.data;
  },

  getTodo: async (id) => {
    const response = await apiClient.get(`/api/todos/${id}/`);
    return response.data;
  },

  updateTodo: async (id, todoData) => {
    const response = await apiClient.put(`/api/todos/${id}/`, todoData);
    return response.data;
  },

  patchTodo: async (id, todoData) => {
    const response = await apiClient.patch(`/api/todos/${id}/`, todoData);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await apiClient.delete(`/api/todos/${id}/`);
    return response.data;
  },

  completeTodo: async (id) => {
    const response = await apiClient.post(`/api/todos/${id}/complete/`);
    return response.data;
  },
};

