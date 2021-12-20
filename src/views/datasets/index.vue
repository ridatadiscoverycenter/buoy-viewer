<template>
  <DashboardLayout>
    <router-view v-slot="{ Component }">
      <Suspense>
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
