<template>
  <DashboardLayout>
    <router-view v-slot="{ Component }">
      <Suspense :key="$route.path">
        <component :is="Component"></component>

        <template #fallback>
          <LoadingSpinner :loading="true" />
        </template>
      </Suspense>
    </router-view>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import LoadingSpinner from "@/components/base/LoadingSpinner.vue";
</script>
