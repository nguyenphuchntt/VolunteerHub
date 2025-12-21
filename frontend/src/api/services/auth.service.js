import api from '../api';
import Cookies from 'js-cookie';

export const authService = {
  /**
   * Authenticates user and stores JWT token in cookies.
   * 
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication response with token
   */
  async login(usernameOrEmail, password) {
    const response = await api.post('/auth/login', { usernameOrEmail, password });
    // Store JWT in cookie (7 days expiry)
    Cookies.set('jwt_token', response.data.token, { expires: 7, secure: window.location.protocol === 'https:' });
    return response.data;
  },

  /**
   * Logs out user by removing JWT token from cookies.
   */
  logout() {
    Cookies.remove('jwt_token');
  },

  /**
   * Checks if user is authenticated.
   * 
   * @returns {boolean} True if JWT token exists
   */
  isAuthenticated() {
    return !!Cookies.get('jwt_token');
  },

  /**
   * Retrieves JWT token from cookies.
   * 
   * @returns {string|undefined} JWT token
   */
  getToken() {
    return Cookies.get('jwt_token');
  }
};
