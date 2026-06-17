import { apiClient } from './apiClient';

export const api = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    return apiClient
      .get<T>(url, { params })
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      });
  },
  post: async <T>(url: string, data?: unknown): Promise<T> => {
    return apiClient
      .post<T>(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      });
  },
  put: async <T>(url: string, data?: unknown): Promise<T> => {
    return apiClient
      .put<T>(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      });
  },
  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    return apiClient
      .patch<T>(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      });
  },
  delete: async <T>(url: string): Promise<T> => {
    return apiClient
      .delete<T>(url)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response?.data || error;
      });
  }
} as const;
