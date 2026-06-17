import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false);
  const setIsAuthenticated = (nextIsAuthenticated: boolean): void => {
    isAuthenticated.value = nextIsAuthenticated;
  };

  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const setTokens = (nextTokens: { accessToken: string; refreshToken: string }): void => {
    accessToken.value = nextTokens.accessToken;
    refreshToken.value = nextTokens.refreshToken;
  };

  const clearStore = (): void => {
    accessToken.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;
  };

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
    setIsAuthenticated,
    setTokens,
    clearStore
  };
});
