import api from './api';

export const companyService = {
  getCompanyReadinessReports: async () => {
    const response = await api.get('/company-readiness');
    return response.data;
  },

  getCompanyReadiness: async (companyName) => {
    const response = await api.get(`/company-readiness/${companyName}`);
    return response.data;
  },

  generateCompanyReadiness: async (companyName) => {
    const response = await api.post(`/company-readiness/${companyName}`);
    return response.data;
  },
};
