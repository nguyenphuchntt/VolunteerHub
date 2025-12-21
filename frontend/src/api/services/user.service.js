import api from '../api';

export const userService = {
  /**
   * Registers new user account.
   * 
   * @param {Object} data - Registration data (username, password, email)
   * @returns {Promise<Object>} Created user
   */
  async register(data) {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  /**
   * Searches users with filters.
   * 
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} Paginated users
   */
  async searchUsers(params = {}) {
    const response = await api.get('/users/search', { params });
    return response.data;
  },

  /**
   * Gets user profile by ID.
   * 
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Updates user role (ADMIN only).
   * 
   * @param {string} userId - User ID
   * @param {string} role - New role
   * @returns {Promise<Object>} Updated user
   */
  async updateUserRole(userId, role) {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Updates user status (ADMIN only).
   * 
   * @param {string} userId - User ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated user
   */
  async updateUserStatus(userId, status) {
    const response = await api.patch(`/users/${userId}/status`, { status });
    return response.data;
  },

  /**
   * Gets user's followers count.
   * 
   * @param {string} userId - User ID
   * @returns {Promise<number>} Followers count
   */
  async getFollowersCount(userId) {
    const response = await api.get(`/users/${userId}/followers-count`);
    return response.data; // Long
  },

  /**
   * Gets count of users being followed.
   * 
   * @param {string} userId - User ID
   * @returns {Promise<number>} Following count
   */
  async getFollowingCount(userId) {
    const response = await api.get(`/users/${userId}/following-count`);
    return response.data; // Long
  },

  /**
   * Gets paginated list of followers.
   * 
   * @param {string} userId - User ID
   * @param {Object} params - Pagination parameters
   * @returns {Promise<Object>} Paginated followers
   */
  async getFollowersList(userId, params = {}) {
    const response = await api.get(`/users/${userId}/followers-list`, { params });
    return response.data; // Page<FollowUserDTO>
  },

  /**
   * Gets paginated list of following users.
   * 
   * @param {string} userId - User ID
   * @param {Object} params - Pagination parameters
   * @returns {Promise<Object>} Paginated following
   */
  async getFollowingList(userId, params = {}) {
    const response = await api.get(`/users/${userId}/following-list`, { params });
    return response.data; // Page<FollowUserDTO>
  },

  /**
   * Follows a user.
   * 
   * @param {string} userId - User ID to follow
   * @returns {Promise<Object>} Follow relationship
   */
  async followUser(userId) {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  /**
   * Unfollows a user.
   * 
   * @param {string} userId - User ID to unfollow
   * @returns {Promise<void>}
   */
  async unfollowUser(userId) {
    await api.delete(`/users/${userId}/unfollow`);
  },

  /**
   * Checks if following a user.
   * 
   * @param {string} userId - User ID to check
   * @returns {Promise<boolean>} True if following
   */
  async isFollowing(userId) {
    const response = await api.get(`/users/${userId}/is-following`);
    return response.data; // Boolean
  }
};
