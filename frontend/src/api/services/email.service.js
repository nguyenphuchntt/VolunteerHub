import api from '../api';

export const emailService = {
  // GET /api/auth/email/verify?token=
  async verifyEmail(token) {
    const response = await api.get('/auth/email/verify', { params: { token } });
    return response.data;
  },

  // GET /api/auth/email/validate-token?token=
  async validateToken(token) {
    const response = await api.get('/auth/email/validate-token', { params: { token } });
    return response.data;
  },

  // POST /api/auth/email/resend
  async resendVerificationEmail(email) {
    const response = await api.post('/auth/email/resend', { email });
    return response.data;
  },
};
