import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://app-a-p-p-adqaj.ondigitalocean.app/api';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

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

    // Skip adding Authorization header for login and register endpoints
    const isAuthEndpoint =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register');

    if (isAuthEndpoint) {
      console.log('Auth endpoint detected - skipping Authorization header');
    } else if (token) {
      // Add Authorization header only for non-auth endpoints
      const authPrefix = token.startsWith('eyJ') ? 'Bearer' : 'Token';
      config.headers.Authorization = `${authPrefix} ${token}`;
      console.log(`Authorization header added with ${authPrefix} prefix`);
    } else {
      console.log('No Authorization header (no token)');
    }

    
    if (config.data instanceof FormData) {
      
      delete config.headers['Content-Type'];
      console.log('FormData detected - Content-Type removed (browser will set multipart/form-data with boundary)');
    } else if (!config.headers['Content-Type']) {
      
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
