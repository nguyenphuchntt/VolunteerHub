import api from '../api';

export const profileService = {
  // GET /api/me/profile
  async getMyProfile() {
    const response = await api.get('/me/profile');
    return response.data;
  },

  // PATCH /api/me/profile/update
  async updateProfile(data) {
    const response = await api.patch('/me/profile/update', data);
    return response.data;
  },

  // PATCH /api/me/profile/change-password
  async changePassword(data) {
    await api.patch('/me/profile/change-password', data);
  },

  // DELETE /api/me/profile/delete
  async deleteProfile(password) {
    await api.delete('/me/profile/delete', { data: { password } });
  }
};
