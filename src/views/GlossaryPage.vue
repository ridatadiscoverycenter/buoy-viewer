<template>
  <DashboardLayout>
    <DashboardCard>
      <template #subtitle>
        <span class="title">Agencies</span>
        <div class="content">
          <p>
            Some definitions here
          </p>
        </div> 
        <span class="title">Data Variables</span> 
        <div class="content">
          <p>
            Some definitions here
          </p>
        </div>
      </template>
    </DashboardCard>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
</script>