import api from '../api';

export const managerService = {
  // GET /api/manager/pending-users
  async getPendingUsers(params = {}) {
    const response = await api.get('/manager/pending-users', { params });
    return response.data;
  }
};
