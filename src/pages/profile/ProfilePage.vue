<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { EditProfileDialog } from 'features/profile';
import { useGetProfile, type User } from 'entities/user';
import { ROUTES } from 'shared/constants/routes';
import { useAuthStore } from 'shared/store';
import { ProgressCircular } from 'shared/ui/progress-circular';

const router = useRouter();
const authStore = useAuthStore();

const { data: profile, isPending } = useGetProfile();

const isEditDialogOpen = ref<boolean>(false);

const currentUser = computed<User | null>(() => profile.value ?? authStore.user);

const navigateToBoards = (): void => {
  router.push(ROUTES.boards);
};

const openEditDialog = (): void => {
  isEditDialogOpen.value = true;
};

const handleProfileUpdate = (updatedUser: User): void => {
  authStore.setUser(updatedUser);
};
</script>

<template>
  <div class="py-8">
    <div class="d-flex align-center ga-4 mb-8">
      <v-btn icon="mdi-arrow-left" variant="text" @click="navigateToBoards" />

      <div>
        <h1 class="text-headline-large font-weight-bold mb-1">Profile</h1>
        <p class="text-body-large text-medium-emphasis mb-0">Your account information</p>
      </div>
    </div>

    <ProgressCircular v-if="isPending && !currentUser" size="large" color="primary" />

    <v-card v-else-if="currentUser" class="profile-card" rounded="xl" elevation="2">
      <v-card-text class="pa-6">
        <div class="d-flex justify-space-between align-start mb-6">
          <div class="d-flex align-center ga-4">
            <v-avatar color="primary" size="64">
              <v-icon icon="mdi-account-circle" size="40" />
            </v-avatar>

            <div>
              <p class="text-overline text-medium-emphasis mb-1">Name</p>
              <p class="text-headline-small font-weight-medium mb-0">{{ currentUser.name }}</p>
            </div>
          </div>

          <v-btn color="primary" variant="tonal" prepend-icon="mdi-pencil" @click="openEditDialog">Edit</v-btn>
        </div>

        <v-divider class="mb-6" />

        <div>
          <p class="text-overline text-medium-emphasis mb-1">Email</p>
          <p class="text-body-large mb-0">{{ currentUser.email }}</p>
        </div>
      </v-card-text>
    </v-card>

    <EditProfileDialog
      v-if="currentUser && isEditDialogOpen"
      v-model="isEditDialogOpen"
      :user="currentUser"
      @success="handleProfileUpdate"
    />
  </div>
</template>

<style scoped lang="scss">
.profile-card {
  max-width: 640px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
