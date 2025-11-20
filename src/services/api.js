import axios from 'axios';

// TEMPORARY FIX: Use direct backend URL to avoid CSRF origin issues with proxy
// Backend needs to add http://localhost:3000 to CSRF_TRUSTED_ORIGINS if using proxy
const API_BASE_URL = 'https://app-a-p-p-adqaj.ondigitalocean.app/api';

// Original code (causes CSRF origin error with proxy):
// const API_BASE_URL = process.env.NODE_ENV === 'development'
//   ? '/api'
//   : 'https://app-a-p-p-adqaj.ondigitalocean.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Token in localStorage:', token ? token.substring(0, 10) + '...' : 'No token');
    console.log('Request data type:', config.data instanceof FormData ? 'FormData' : typeof config.data);

    // Add Authorization header
    if (token) {
      config.headers.Authorization = `Token ${token}`;
      console.log('Authorization header added');
    } else {
      console.log('No Authorization header (no token)');
    }

    // Set Content-Type based on data type
    if (config.data instanceof FormData) {
      // For FormData, don't set Content-Type - browser will set it with boundary
      delete config.headers['Content-Type'];
      console.log('FormData detected - Content-Type removed (browser will set multipart/form-data with boundary)');
    } else if (!config.headers['Content-Type']) {
      // For JSON requests, set Content-Type
      config.headers['Content-Type'] = 'application/json';
      console.log('JSON request - Content-Type set to application/json');
    }

    console.log('Final request headers:', config.headers);

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response Error:', error);

    // Network error (CORS, no internet, etc.)
    if (!error.response) {
      console.error('Network Error - Check CORS settings on backend');
      return Promise.reject({
        message: 'Network Error: Unable to connect to server. Please check your internet connection or contact support.',
        errors: {}
      });
    }

    // Only redirect to login if 401 and NOT on login/register/upload endpoints
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
      const isUploadEndpoint = requestUrl.includes('/uploads');

      // Don't auto-redirect on upload failures - let the component handle it
      if (!isAuthEndpoint && !isUploadEndpoint) {
        // Token expired or invalid - only redirect if not on auth pages
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
