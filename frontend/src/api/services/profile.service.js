import api from '../api';

export const profileService = {
  /**
   * Gets authenticated user's profile.
   * 
   * @returns {Promise<Object>} User profile data
   */
  async getMyProfile() {
    const response = await api.get('/me/profile');
    return response.data;
  },

  /**
   * Updates user profile information.
   * 
   * @param {Object} data - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(data) {
    const response = await api.patch('/me/profile/update', data);
    return response.data;
  },

  /**
   * Changes user password.
   * 
   * @param {Object} data - Old and new password
   * @returns {Promise<void>}
   */
  async changePassword(data) {
    await api.patch('/me/profile/change-password', data);
  },

  /**
   * Deletes user account after password confirmation.
   * 
   * @param {string} password - User password
   * @returns {Promise<void>}
   */
  async deleteProfile(password) {
    await api.delete('/me/profile/delete', { data: { password } });
  }
};
