import api from '../api';

export const userService = {
  // POST /api/users/register
  // RequestBody: { username, password, confirmPassword, email }
  async register(data) {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  // GET /api/users/search?params
  async searchUsers(params = {}) {
    const response = await api.get('/users/search', { params });
    return response.data;
  },

  // GET /api/users/{id}
  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // PATCH /api/users/{id}/role - Update user role (ADMIN only)
  async updateUserRole(userId, role) {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },

  // PATCH /api/users/{id}/status - Update user status (ADMIN only)
  async updateUserStatus(userId, status) {
    const response = await api.patch(`/users/${userId}/status`, { status });
    return response.data;
  }
};

