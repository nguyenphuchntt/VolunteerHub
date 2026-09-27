import api from '../api';

export const emailService = {
  // POST /api/auth/email/verify-otp
  async verifyOtp(email, otp) {
    const response = await api.post('/auth/email/verify-otp', { email, otp });
    return response.data;
  },

  // POST /api/auth/email/resend-otp
  async resendOtp(email) {
    const response = await api.post('/auth/email/resend-otp', { email });
    return response.data;
  },
};
