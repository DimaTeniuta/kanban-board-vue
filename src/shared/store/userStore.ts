import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { User } from 'shared/types/user';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  const setUser = (nextUser: User): void => {
    user.value = nextUser;
  };

  const clearUser = (): void => {
    user.value = null;
  };

  return {
    user,
    setUser,
    clearUser
  };
});
