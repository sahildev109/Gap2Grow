import apiClient from './apiClient';

export const reportService = {
  // Career Report
  generateCareerReport: async (skillGapId) => {
    const response = await apiClient.post('/reports/career', { skillGapId });
    return response.data;
  },

  getLatestCareerReport: async () => {
    const response = await apiClient.get('/reports/career');
    return response.data;
  },

  // Learning Roadmap
  generateLearningRoadmap: async (skillGapId) => {
    const response = await apiClient.post('/reports/roadmap', { skillGapId });
    return response.data;
  },

  getLatestLearningRoadmap: async () => {
    const response = await apiClient.get('/reports/roadmap');
    return response.data;
  },

  // Download report as PDF
  downloadReportPDF: (reportType, reportId) => {
    return `${apiClient.defaults.baseURL}/reports/${reportType}/${reportId}/download`;
  }
};

export default reportService;
