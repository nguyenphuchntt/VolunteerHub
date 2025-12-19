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
  },

  // ========== Follow APIs ==========

  // GET /api/users/{id}/followers-count
  async getFollowersCount(userId) {
    const response = await api.get(`/users/${userId}/followers-count`);
    return response.data; // Long
  },

  // GET /api/users/{id}/following-count
  async getFollowingCount(userId) {
    const response = await api.get(`/users/${userId}/following-count`);
    return response.data; // Long
  },

  // GET /api/users/{id}/followers-list
  async getFollowersList(userId, params = {}) {
    const response = await api.get(`/users/${userId}/followers-list`, { params });
    return response.data; // Page<FollowUserDTO>
  },

  // GET /api/users/{id}/following-list
  async getFollowingList(userId, params = {}) {
    const response = await api.get(`/users/${userId}/following-list`, { params });
    return response.data; // Page<FollowUserDTO>
  },

  // POST /api/users/{id}/follow - Follow a user
  async followUser(userId) {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  // DELETE /api/users/{id}/unfollow - Unfollow a user
  async unfollowUser(userId) {
    await api.delete(`/users/${userId}/unfollow`);
  },

  // GET /api/users/{id}/is-following - Check if following
  async isFollowing(userId) {
    const response = await api.get(`/users/${userId}/is-following`);
    return response.data; // Boolean
  }
};
