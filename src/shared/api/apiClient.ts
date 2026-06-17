import axios from 'axios';

import { router } from 'app/router';
import { ROUTES } from 'shared/constants/routes';
import { useAuthStore, useUserStore } from 'shared/store';

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
    const { accessToken } = useAuthStore();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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

const refreshToken = async (): Promise<{ status: boolean; refreshToken?: string | undefined }> => {
  try {
    const { refreshToken, setTokens } = useAuthStore();
    const { user } = useUserStore();

    if (!refreshToken || !user) {
      return { status: false };
    }

    const response = await apiClient.post<RefreshTokenResponse>(API_ROUTES.refreshToken(), {
      userId: user.id,
      refreshToken
    });

    if (response.status === 200 || response.status === 201) {
      const tokenData = response.data.data;
      setTokens({ accessToken: tokenData.accessToken, refreshToken: tokenData.refreshToken });
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
          const { accessToken } = useAuthStore();
          if (!accessToken) {
            throw new Error('Token is not found');
          }

          callFailedRequests(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return apiClient(originalRequest);
        } else {
          const { clearStore, accessToken } = useAuthStore();
          if (!isLoggingOut && accessToken) {
            isLoggingOut = true;
            await apiClient.post(API_ROUTES.logout());
          }
          const { clearUser } = useUserStore();
          clearStore();
          clearUser();
          router.push({ path: ROUTES.login });
        }
      } catch (error) {
        const { clearStore, accessToken } = useAuthStore();
        if (!isLoggingOut && accessToken) {
          try {
            isLoggingOut = true;
            await apiClient.post(API_ROUTES.logout());
          } catch (error) {
            console.error('Logout failed', error);
          }
        }

        console.error('Refresh token failed', error);

        const { clearUser } = useUserStore();
        clearStore();
        clearUser();
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
