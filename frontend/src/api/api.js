import axios from 'axios';
import Cookies from 'js-cookie';

// In development, Vite proxy handles /api requests to http://localhost:8080
// In production, you may need to set VITE_API_BASE_URL to your backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});


// Request interceptor - add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      Cookies.remove('jwt_token');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/signin') &&
        !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }

    // Handle 403 ACCOUNT_BANNED - account has been banned
    if (error.response?.status === 403 && error.response?.data?.error === 'ACCOUNT_BANNED') {
      Cookies.remove('jwt_token');
      // Store banned message for display on signin page
      sessionStorage.setItem('account_banned_message', error.response?.data?.message || 'Tài khoản của bạn đã bị khóa.');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/signin') &&
        !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin?banned=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
