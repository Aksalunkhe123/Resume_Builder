import axios from 'axios';
import { getToken, clearAuthStorage } from '../utils/authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const studentProfileAPI = {
  createProfile: (data) => {
    const isFormData = data instanceof FormData;
    return api.post('/student-profile', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : undefined);
  },
  getProfile: () => api.get('/student-profile'),
  updateProfile: (data) => {
    const isFormData = data instanceof FormData;
    return api.put('/student-profile', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' },
    } : undefined);
  },
  deleteProfile: () => api.delete('/student-profile'),
};

export const resumeAPI = {
  uploadResume: (formData) =>
    api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  listResumes: () => api.get('/resume/list'),
  deleteResume: (id) => api.delete(`/resume/delete/${id}`),
};

export const analysisAPI = {
  analyzeResume: (resumeId) => api.post(`/analysis/analyze/${resumeId}`),
  listAnalyses: () => api.get('/analysis/list'),
  getAnalysis: (id) => api.get(`/analysis/${id}`),
};

export const skillGapAPI = {
  getRoles: () => api.get('/skill-gap/roles'),
  previewSkillGap: (data) => api.post('/skill-gap/preview', data),
  analyzeSkillGap: (data) => api.post('/skill-gap/analyze', data),
  listSkillGaps: () => api.get('/skill-gap/list'),
  getSkillGap: (id) => api.get(`/skill-gap/${id}`),
};

export default api;
