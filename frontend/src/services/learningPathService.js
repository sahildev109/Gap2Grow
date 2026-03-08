import apiClient from './apiClient';

const learningPathService = {
  // Get all learning paths
  getLearningPaths: async () => {
    try {
      const response = await apiClient.get('/learning-paths');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch learning paths' };
    }
  },

  // Get active learning path
  getActiveLearningPath: async () => {
    try {
      const response = await apiClient.get('/learning-paths/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'No active learning path found' };
    }
  },

  // Create learning path
  createLearningPath: async (pathData) => {
    try {
      const response = await apiClient.post('/learning-paths', pathData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create learning path' };
    }
  },

  // Update learning path
  updateLearningPath: async (pathId, updateData) => {
    try {
      const response = await apiClient.put(`/learning-paths/${pathId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update learning path' };
    }
  },

  // Update milestone
  updateMilestone: async (pathId, milestoneId, updateData) => {
    try {
      const response = await apiClient.put(
        `/learning-paths/${pathId}/milestones/${milestoneId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update milestone' };
    }
  },

  // Delete learning path
  deleteLearningPath: async (pathId) => {
    try {
      const response = await apiClient.delete(`/learning-paths/${pathId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete learning path' };
    }
  }
};

export default learningPathService;
