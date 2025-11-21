import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const payload = {
        username: userData.username,
        email: userData.email,
        organization_name: userData.organization_name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password: userData.password,
        password2: userData.confirm_password,
      };

      console.log('Registration payload:', payload);
      const response = await api.post('/auth/register/', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Login attempt with credentials:', { username: credentials.username });
      console.log('Current localStorage token before login:', localStorage.getItem('token'));

      const response = await api.post('/auth/login/', credentials);

      console.log('Login API response:', response.data);
      console.log('Response status:', response.status);

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;

        console.log('Login successful! Token received:', token?.substring(0, 10) + '...');
        console.log('User data:', user);

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login error caught:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error.response?.data || error;
    }
  },

  // Logout user
  logout: async () => {
    console.log('Logout initiated...');
    console.log('Current token before logout:', localStorage.getItem('token')?.substring(0, 10) + '...');

    // TEMPORARY FIX: Skip backend logout API call if it's causing issues
    // Uncomment the try-catch block below if you want to call backend logout

    /*
    try {
      // Call logout API endpoint
      console.log('Calling backend logout API...');
      const response = await api.post('/auth/logout/');
      console.log('Logout API response:', response.data);
    } catch (error) {
      console.error('Logout API error:', error);
      console.error('Logout API error response:', error.response?.data);
      // Continue with local cleanup even if API call fails
    }
    */

    // Clear local storage (this is sufficient for Token auth)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Local storage cleared. Token removed.');
    console.log('Token after cleanup:', localStorage.getItem('token'));
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
