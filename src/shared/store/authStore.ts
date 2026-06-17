import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { User } from 'shared/types/user';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null);
    const setUser = (nextUser: User): void => {
      user.value = nextUser;
    };

    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const isAuthenticated = computed(() => Boolean(accessToken.value));

    const setTokens = (nextTokens: { accessToken: string; refreshToken: string }): void => {
      accessToken.value = nextTokens.accessToken;
      refreshToken.value = nextTokens.refreshToken;
    };

    const clearStore = (): void => {
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
    };

    return {
      isAuthenticated,
      accessToken,
      refreshToken,
      user,
      setUser,
      setTokens,
      clearStore
    };
  },
  {
    persist: {
      key: 'auth',
      storage: sessionStorage,
      pick: ['accessToken', 'refreshToken', 'user']
    }
  }
);
