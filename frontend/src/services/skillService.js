import apiClient from './apiClient';

const skillService = {
  // Get all skills
  getSkills: async () => {
    try {
      const response = await apiClient.get('/skills');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch skills' };
    }
  },

  // Get single skill
  getSkillById: async (skillId) => {
    try {
      const response = await apiClient.get(`/skills/${skillId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch skill' };
    }
  },

  // Create skill
  createSkill: async (skillData) => {
    try {
      const response = await apiClient.post('/skills', skillData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create skill' };
    }
  },

  // Update skill
  updateSkill: async (skillId, skillData) => {
    try {
      const response = await apiClient.put(`/skills/${skillId}`, skillData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update skill' };
    }
  },

  // Delete skill
  deleteSkill: async (skillId) => {
    try {
      const response = await apiClient.delete(`/skills/${skillId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete skill' };
    }
  },

  // Search skills
  searchSkills: async (query, proficiency) => {
    try {
      const response = await apiClient.get('/skills/search', {
        params: { q: query, proficiency }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to search skills' };
    }
  }
};

export default skillService;
