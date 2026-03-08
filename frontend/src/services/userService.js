import apiClient from './apiClient';

const userService = {
  // Get profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile', userData);
      localStorage.setItem('gap2grow_user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await apiClient.put('/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to change password' };
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await apiClient.delete('/users/account', {
        data: { password }
      });
      localStorage.clear();
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete account' };
    }
  }
};

export default userService;
