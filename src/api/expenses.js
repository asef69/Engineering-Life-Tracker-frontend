import apiClient from './client';

export const expensesAPI = {
  getExpenses: async () => {
    const response = await apiClient.get('/api/expenses/');
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await apiClient.post('/api/expenses/', expenseData);
    return response.data;
  },

  getSummary: async () => {
    const response = await apiClient.get('/api/expenses/summary/');
    return response.data;
  },
};

