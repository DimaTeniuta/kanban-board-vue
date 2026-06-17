import { defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { ROUTES } from 'shared/constants/routes';
import { useAuthStore } from 'shared/store/authStore';

// NOTE: warning about defineAsyncComponent from vue-router is expected
// we use it in order to to use Suspense during downloading the component
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: `${ROUTES.register}`,
      name: 'RegisterPage',
      component: defineAsyncComponent({
        loader: () => import('pages/register/RegisterPage.vue')
      })
    },
    {
      path: `${ROUTES.login}`,
      name: 'LoginPage',
      component: defineAsyncComponent({
        loader: () => import('pages/login/LoginPage.vue')
      })
    },
    {
      path: `${ROUTES.boards}`,
      name: 'BoardsPage',
      component: defineAsyncComponent({
        loader: () => import('pages/boards/BoardsPage.vue')
      })
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.path !== ROUTES.login && to.path !== ROUTES.register && !authStore.isAuthenticated) {
    return ROUTES.login;
  }

  if ((to.path === ROUTES.login || to.path === ROUTES.register) && authStore.isAuthenticated) {
    return ROUTES.boards;
  }

  return true;
});
