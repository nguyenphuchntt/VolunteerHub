import api from '../api';

export const adminService = {
  /**
   * Creates new user account (admin).
   * 
   * @param {Object} data - User data with role and status
   * @returns {Promise<Object>} Created user
   */
  async createUser(data) {
    const response = await api.post('/admin/users/create-user', data);
    return response.data;
  },

  /**
   * Updates user role (admin).
   * 
   * @param {string} userId - User ID
   * @param {string} role - New role
   * @returns {Promise<Object>} Updated user
   */
  async updateUserRole(userId, role) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Updates user status (admin).
   * 
   * @param {string} userId - User ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated user
   */
  async updateUserStatus(userId, status) {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  /**
   * Deletes user account (admin).
   * 
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    await api.delete(`/admin/users/${userId}/delete`);
  },

  /**
   * Changes user password (admin).
   * 
   * @param {string} userId - User ID
   * @param {Object} data - New password data
   * @returns {Promise<void>}
   */
  async changeUserPassword(userId, data) {
    await api.patch(`/admin/users/${userId}/change-password`, data);
  },

  /**
   * Updates user profile details (admin).
   * 
   * @param {string} userId - User ID
   * @param {Object} data - Profile data
   * @returns {Promise<Object>} Updated user
   */
  async updateUserDetails(userId, data) {
    const response = await api.patch(`/admin/users/${userId}/update-details`, data);
    return response.data;
  },

  /**
   * Gets admin dashboard overview statistics.
   * 
   * @returns {Promise<Object>} Dashboard stats
   */
  async getStatsOverview() {
    const response = await api.get('/admin/stats/overview');
    return response.data;
  },

  /**
   * Gets chart data for admin dashboard.
   * 
   * @param {string} type - Chart type (new_users_last_7_days, etc.)
   * @returns {Promise<Object>} Chart data
   */
  async getStatsChart(type) {
    const response = await api.get('/admin/stats/charts', { params: { type } });
    return response.data;
  },

  /**
   * Gets ranking data for admin dashboard.
   * 
   * @param {string} type - Ranking type (top_events, top_active_users, etc.)
   * @returns {Promise<Array>} Ranking list
   */
  async getStatsRanking(type) {
    const response = await api.get('/admin/stats/rankings', { params: { type } });
    return response.data;
  },

  /**
   * Gets all events for data export.
   * 
   * @returns {Promise<Array>} All events
   */
  async getAllEvents() {
    const response = await api.get('/events/find-all');
    return response.data;
  },

  /**
   * Gets all event participants for export.
   * 
   * @returns {Promise<Array>} All event users
   */
  async getAllEventUsers() {
    const response = await api.get('/event-users/get-all');
    return response.data;
  },

  /**
   * Gets all participants for a specific event.
   * 
   * @param {number} eventId - Event ID
   * @returns {Promise<Array>} Event participants
   */
  async getAllEventUsersByEvent(eventId) {
    const response = await api.get(`/event-users/get-all-by-event/${eventId}`);
    return response.data;
  },

  /**
   * Gets all events a user has participated in.
   * 
   * @param {string} accountId - Account ID
   * @returns {Promise<Array>} User's event participations
   */
  async getAllEventUsersByAccount(accountId) {
    const response = await api.get(`/event-users/get-all-by-account/${accountId}`);
    return response.data;
  }
};
