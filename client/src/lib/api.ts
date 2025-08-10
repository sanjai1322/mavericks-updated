import { apiRequest } from './queryClient';
import type { InsertUser, LoginCredentials } from '@shared/schema';

export const api = {
  auth: {
    login: async (credentials: LoginCredentials) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return response.json();
    },
    register: async (userData: InsertUser) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response.json();
    },
    logout: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    getCurrentUser: async () => {
      const response = await apiRequest('GET', '/api/auth/me');
      return response.json();
    },
  },
  profile: {
    getProfile: async () => {
      const response = await apiRequest('GET', '/api/profile');
      return response.json();
    },
    updateProfile: async (updates: any) => {
      const response = await apiRequest('POST', '/api/profile', updates);
      return response.json();
    },
    getActivities: async () => {
      const response = await apiRequest('GET', '/api/profile/activities');
      return response.json();
    },
  },
  assessments: {
    getAll: async () => {
      const response = await apiRequest('GET', '/api/assessments');
      return response.json();
    },
    submit: async (assessmentId: string, code: string) => {
      const response = await apiRequest('POST', '/api/assessments/submit', {
        assessmentId,
        code,
      });
      return response.json();
    },
  },
  learningPath: {
    getAll: async () => {
      const response = await apiRequest('GET', '/api/learning-path');
      return response.json();
    },
  },
  hackathons: {
    getAll: async () => {
      const response = await apiRequest('GET', '/api/hackathons');
      return response.json();
    },
    getSubmissions: async () => {
      const response = await apiRequest('GET', '/api/hackathons/submissions');
      return response.json();
    },
    join: async (hackathonId: string) => {
      const response = await apiRequest('POST', '/api/hackathons/join', { hackathonId });
      return response.json();
    },
  },
  leaderboard: {
    get: async () => {
      const response = await apiRequest('GET', '/api/leaderboard');
      return response.json();
    },
  },
};
