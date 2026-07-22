import api from './api';

export const resumeBuilderService = {
  generateATSResume: async () => {
    const response = await api.get('/resume-builder/generate');
    return response.data;
  },
};
