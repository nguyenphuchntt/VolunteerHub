import api from '../api';
import Cookies from 'js-cookie';

export const authService = {
  // POST /api/auth/login
  async login(usernameOrEmail, password) {
    const response = await api.post('/auth/login', { usernameOrEmail, password });
    // Store JWT in cookie (7 days expiry)
    Cookies.set('jwt_token', response.data.token, { expires: 7, secure: window.location.protocol === 'https:' });
    return response.data;
  },

  logout() {
    Cookies.remove('jwt_token');
  },

  isAuthenticated() {
    return !!Cookies.get('jwt_token');
  },

  getToken() {
    return Cookies.get('jwt_token');
  }
};
