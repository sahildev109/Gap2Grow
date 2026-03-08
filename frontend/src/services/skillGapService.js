import apiClient from './apiClient';

const skillGapService = {
  // Get latest skill gap
  getLatestSkillGap: async () => {
    try {
      const response = await apiClient.get('/skill-gaps/latest');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'No skill gap analysis found' };
    }
  },

  // Get all skill gaps
  getAllSkillGaps: async () => {
    try {
      const response = await apiClient.get('/skill-gaps');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch skill gaps' };
    }
  },

  // Create skill gap analysis
  createSkillGap: async (analysisData) => {
    try {
      const response = await apiClient.post('/skill-gaps', analysisData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create skill gap analysis' };
    }
  },

  // Update skill gap
  updateSkillGap: async (skillGapId, updateData) => {
    try {
      const response = await apiClient.put(`/skill-gaps/${skillGapId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update skill gap' };
    }
  }
};

export default skillGapService;
