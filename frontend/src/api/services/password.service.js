import api from '../api';

export const passwordService = {
  // POST /api/auth/password/forgot
  async forgotPassword(email) {
    const response = await api.post('/auth/password/forgot', { email });
    return response.data;
  },

  // GET /api/auth/password/validate-token?token=
  async validateToken(token) {
    const response = await api.get('/auth/password/validate-token', { params: { token } });
    return response.data;
  },

  // POST /api/auth/password/reset
  async resetPassword(token, newPassword, confirmPassword) {
    const response = await api.post('/auth/password/reset', {
      token,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
