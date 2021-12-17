<template>
  <DashboardLayout>
    <Suspense>
      <router-view />

      <template #fallback>
        <LoadingSpinner :loading="true" />
      </template>
    </Suspense>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import LoadingSpinner from "@/components/base/LoadingSpinner.vue";
</script>
