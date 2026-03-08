import apiClient from './apiClient';

const authService = {
  // Signup
  signup: async (userData) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      if (response.data.token) {
        localStorage.setItem('gap2grow_token', response.data.token);
        localStorage.setItem('gap2grow_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Signup failed' };
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('gap2grow_token', response.data.token);
        localStorage.setItem('gap2grow_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('gap2grow_token');
    localStorage.removeItem('gap2grow_user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('gap2grow_token');
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('gap2grow_token');
  },

  // Get user from localStorage
  getStoredUser: () => {
    const user = localStorage.getItem('gap2grow_user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
