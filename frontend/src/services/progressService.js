import apiClient from './apiClient';

const progressService = {
  // Get user progress
  getProgress: async () => {
    try {
      const response = await apiClient.get('/progress');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch progress' };
    }
  },

  // Update skill progress
  updateSkillProgress: async (progressData) => {
    try {
      const response = await apiClient.post('/progress/skill-progress', progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update skill progress' };
    }
  },

  // Add completed resource
  addCompletedResource: async (resourceData) => {
    try {
      const response = await apiClient.post('/progress/completed-resource', resourceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add completed resource' };
    }
  },

  // Add project
  addProject: async (projectData) => {
    try {
      const response = await apiClient.post('/progress/project', projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add project' };
    }
  },

  // Add badge
  addBadge: async (badgeData) => {
    try {
      const response = await apiClient.post('/progress/badge', badgeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add badge' };
    }
  },

  // Update learning streak
  updateLearningStreak: async (streakData) => {
    try {
      const response = await apiClient.put('/progress/streak', streakData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update learning streak' };
    }
  },

  // Get progress statistics
  getProgressStats: async () => {
    try {
      const response = await apiClient.get('/progress/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch statistics' };
    }
  }
};

export default progressService;
