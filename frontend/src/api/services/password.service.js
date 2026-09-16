import api from '../api';

export const passwordService = {
  // POST /api/auth/password/forgot
  async forgotPassword(email) {
    const response = await api.post('/auth/password/forgot', { email });
    return response.data;
  },

  // POST /api/auth/password/reset (email + otp + new password)
  async resetPassword(email, otp, newPassword, confirmPassword) {
    const response = await api.post('/auth/password/reset', {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
