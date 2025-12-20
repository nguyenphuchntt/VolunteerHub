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
  },

  // Stats APIs
  async getStatsOverview() {
    const response = await api.get('/admin/stats/overview');
    return response.data;
  },

  async getStatsChart(type) {
    const response = await api.get('/admin/stats/charts', { params: { type } });
    return response.data;
  },

  async getStatsRanking(type) {
    const response = await api.get('/admin/stats/rankings', { params: { type } });
    return response.data;
  },

  // ==========================================
  // Data Export APIs
  // ==========================================

  // GET /api/events/find-all - Get all events for export
  async getAllEvents() {
    const response = await api.get('/events/find-all');
    return response.data;
  },

  // GET /api/event-users/get-all - Get all event users for export
  async getAllEventUsers() {
    const response = await api.get('/event-users/get-all');
    return response.data;
  },

  // GET /api/event-users/get-all-by-event/{eventId}
  async getAllEventUsersByEvent(eventId) {
    const response = await api.get(`/event-users/get-all-by-event/${eventId}`);
    return response.data;
  },

  // GET /api/event-users/get-all-by-account/{accountId}
  async getAllEventUsersByAccount(accountId) {
    const response = await api.get(`/event-users/get-all-by-account/${accountId}`);
    return response.data;
  }
};
