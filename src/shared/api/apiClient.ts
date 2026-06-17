import axios from 'axios';

import { router } from 'app/router';
import { ROUTES } from 'shared/constants/routes';
import { useAuthStore } from 'shared/store';

import { API_ROUTES } from './apiRoutes';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface RefreshTokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

const refreshToken = async (): Promise<{ status: boolean }> => {
  try {
    const authStore = useAuthStore();

    if (!authStore.refreshToken || !authStore.user) {
      return { status: false };
    }

    const response = await apiClient.post<RefreshTokenResponse>(API_ROUTES.refreshToken(), {
      userId: authStore.user.id,
      refreshToken: authStore.refreshToken
    });

    if (response.status === 200 || response.status === 201) {
      const tokenData = response.data.data;
      authStore.setTokens({ accessToken: tokenData.accessToken, refreshToken: tokenData.refreshToken });
      return { status: true };
    } else {
      console.error('Refresh token failed', response);
      return { status: false };
    }
  } catch (error) {
    console.error('Refresh token failed', error);
    return { status: false };
  }
};

const UNAUTHORIZED_ERROR_CODE = 401;

let isRefreshing = false;
let isLoggingOut = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const callFailedRequests = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest &&
      error.response?.status === UNAUTHORIZED_ERROR_CODE &&
      !originalRequest.url.includes(API_ROUTES.refreshToken())
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const tokens = await refreshToken();

        if (tokens.status) {
          const authStore = useAuthStore();
          if (!authStore.accessToken) {
            throw new Error('Token is not found');
          }

          callFailedRequests(authStore.accessToken);
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;

          return apiClient(originalRequest);
        } else {
          const authStore = useAuthStore();
          if (!isLoggingOut && authStore.accessToken) {
            isLoggingOut = true;
            await apiClient.post(API_ROUTES.logout());
          }
          authStore.clearStore();
          router.push({ path: ROUTES.login });
        }
      } catch (error) {
        const authStore = useAuthStore();
        if (!isLoggingOut && authStore.accessToken) {
          try {
            isLoggingOut = true;
            await apiClient.post(API_ROUTES.logout());
          } catch (error) {
            console.error('Logout failed', error);
          }
        }

        console.error('Refresh token failed', error);

        authStore.clearStore();
        router.push({ path: ROUTES.login });

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
        isLoggingOut = false;
      }
    }

    return Promise.reject(error);
  }
);
