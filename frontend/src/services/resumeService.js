import apiClient from './apiClient';

const resumeService = {
  // Get all resumes
  getResumes: async () => {
    try {
      const response = await apiClient.get('/resumes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch resumes' };
    }
  },

  // Get current resume
  getCurrentResume: async () => {
    try {
      const response = await apiClient.get('/resumes/current');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'No current resume found' };
    }
  },

  // Upload resume
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to upload resume' };
    }
  },

  // Update resume
  updateResume: async (resumeId, updateData) => {
    try {
      const response = await apiClient.put(`/resumes/${resumeId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update resume' };
    }
  },

  // Delete resume
  deleteResume: async (resumeId) => {
    try {
      const response = await apiClient.delete(`/resumes/${resumeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete resume' };
    }
  }
};

export default resumeService;
