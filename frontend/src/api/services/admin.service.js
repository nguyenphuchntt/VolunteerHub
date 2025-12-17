import api from '../api';

export const adminService = {
  // POST /api/admin/users/create-user
  async createUser(data) {
    const response = await api.post('/admin/users/create-user', data);
    return response.data;
  },

  // PATCH /api/admin/users/{id}/role
  async updateUserRole(userId, role) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // PATCH /api/admin/users/{id}/status
  async updateUserStatus(userId, status) {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  // DELETE /api/admin/users/{id}/delete
  async deleteUser(userId) {
    await api.delete(`/admin/users/${userId}/delete`);
  },

  // PATCH /api/admin/users/{id}/change-password
  async changeUserPassword(userId, data) {
    await api.patch(`/admin/users/${userId}/change-password`, data);
  },

  // PATCH /api/admin/users/{id}/update-details
  async updateUserDetails(userId, data) {
    const response = await api.patch(`/admin/users/${userId}/update-details`, data);
    return response.data;
  }
};
