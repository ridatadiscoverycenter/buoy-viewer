<template>
  <DashboardLayout>
    <DashboardCard>
      <template #subtitle>
        <span class="title">Agencies and Models</span>
        <div class="table-wrapper">
          <table class="table">
            <thead>
                <tr>
                <!-- <th title="Label">Label</th>
                <th title="BART-label">BART-label</th> -->
                <th title="acro">Acronym</th>
                <th title="name">Full Name</th>
                </tr>
            </thead>
            <tbody>
              <tr>
              </tr>                                                                  
            </tbody>
          </table>
        </div>
        <span class="title">Data Variables</span>
        <div class="table-wrapper">
          <table class="table">
            <thead>
                <tr>
                <!-- <th title="Label">Label</th>
                <th title="BART-label">BART-label</th> -->
                <th title="acro">Acronym</th>
                <th title="name">Full Name</th>
                </tr>
            </thead>
            <tbody>
              <tr>
              </tr>                                                                  
            </tbody>
          </table>
        </div>
      </template>
    </DashboardCard>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
</script>


agency_acronyms = [
    {acro: "RIDDC", name: "Rhode Island Data Discovery Center"},
    {acro: "RI C-AIM", name: "Rhode Island Consortium for Coastal Ecology Assessment, Innovation, and Modeling"},
    {acro: "RIDEM-OWR", name: "Rhode Island Department of Environmental Monitoring-Office of Water Resources"},
    {acro: "NBFSMN", name: "Narragansett Bay Fixed Site Monitoring Network"},
    {acro: "URI-GSO", name: "University of Rhode Island, Graduate School of Oceanography"},
    {acro: "NBC", name: "Narragansett Bay Commission"},
    {acro: "RWU", name: "Roger Williams University"},
    {acro: "NBEP", name: "Narragansett Bay Estuary Program"
    {acro: "URI-CI", name: "University of Rhode Island-Coastal Institute"}
    {acro: "OSOM", name: "Ocean State Ocean Model"},
    {acro: "ROMS", name: "Regional Ocean Modelling System"},
]