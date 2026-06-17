import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

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

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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
  accessToken: string;
  refreshToken: string;
}

const isAuthRetryExcluded = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  return url.includes('refresh-token') || url.includes('logout');
};

const forceLogout = async (): Promise<void> => {
  const authStore = useAuthStore();
  authStore.clearStore();

  if (router.currentRoute.value.path !== ROUTES.login) {
    await router.push({ path: ROUTES.login });
  }
};

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
      const { accessToken, refreshToken: nextRefreshToken } = response.data;
      authStore.setTokens({ accessToken, refreshToken: nextRefreshToken });
      return { status: true };
    }

    console.error('Refresh token failed', response);
    return { status: false };
  } catch (error) {
    console.error('Refresh token failed', error);
    return { status: false };
  }
};

const UNAUTHORIZED_ERROR_CODE = 401;

let isRefreshing = false;

interface RefreshSubscriber {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
}

let refreshSubscribers: RefreshSubscriber[] = [];

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (reason: unknown): void => {
  refreshSubscribers.forEach(({ reject }) => reject(reason));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (): Promise<string> =>
  new Promise((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject });
  });

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== UNAUTHORIZED_ERROR_CODE ||
      isAuthRetryExcluded(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      onRefreshFailed(error);
      await forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return subscribeTokenRefresh()
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(async (refreshError) => {
          await forceLogout();
          return Promise.reject(refreshError);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const tokens = await refreshToken();

      if (!tokens.status) {
        onRefreshFailed(error);
        await forceLogout();
        return Promise.reject(error);
      }

      const accessToken = useAuthStore().accessToken;

      if (!accessToken) {
        onRefreshFailed(error);
        await forceLogout();
        return Promise.reject(error);
      }

      onRefreshed(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      onRefreshFailed(refreshError);
      await forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
