<template>
  <DashboardLayout>
    <DashboardCard>
      <template #title> Agencies and Organizations </template>
      <template #content>
        <div class="px-4">
          <GlossaryDefinitions
            v-for="agency in agencyAcronyms"
            :key="agency.acronym"
            :term="agency.acronym"
          >
            {{ agency.name }}
          </GlossaryDefinitions>
        </div>
      </template>
    </DashboardCard>

    <DashboardCard>
      <template #title>Data Variables</template>
      <template #content>
        <div class="px-4">
          <GlossaryDefinitions
            v-for="data in dataAcronyms"
            :key="data.variable"
            :term="data.variable"
            :unit="data.units"
          >
            {{ data.description }}
          </GlossaryDefinitions>
        </div>
      </template>
    </DashboardCard>

    <DashboardCard>
      <template #title>Other Acronyms</template>
      <template #content>
        <div class="px-4">
          <GlossaryDefinitions
            v-for="model in modelAcronyms"
            :key="model.acronym"
            :term="model.acronym"
          >
            {{ model.name }}
          </GlossaryDefinitions>
        </div>
      </template>
    </DashboardCard>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/mainDashboard.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import GlossaryDefinitions from "@/components/base/GlossaryDefinitions.vue";
import { sortByProperty } from "../utils/utils";

const agencyAcronyms = [
  { acronym: "RIDDC", name: "Rhode Island Data Discovery Center" },
  {
    acronym: "RI C-AIM",
    name: "Rhode Island Consortium for Coastal Ecology Assessment, Innovation, and Modeling",
  },
  {
    acronym: "RIDEM-OWR",
    name: "Rhode Island Department of Environmental Monitoring-Office of Water Resources",
  },
  { acronym: "NBFSMN", name: "Narragansett Bay Fixed Site Monitoring Network" },
  {
    acronym: "URI-GSO",
    name: "University of Rhode Island, Graduate School of Oceanography",
  },
  { acronym: "NBC", name: "Narragansett Bay Commission" },
  { acronym: "RWU", name: "Roger Williams University" },
  { acronym: "NBEP", name: "Narragansett Bay Estuary Program" },
  { acronym: "URI-CI", name: "University of Rhode Island-Coastal Institute" },

  {
    acronym: "MassDEP",
    name: "Massachusetts Department of Environmental Protection",
  },
  { acronym: "SNEP", name: "Southern New England Estuary Program" },
  {
    acronym: "NERACOOS",
    name: "Northeast Regional Association Coastal Ocean Observing Systems",
  },
];

const modelAcronyms = [
  {
    acronym: "ERDDAP",
    name: "Environmental Research Division Data Access Program",
  },
  { acronym: "OSOM", name: "Ocean State Ocean Model" },
  { acronym: "ROMS", name: "Regional Ocean Modelling System" },
  { acronym: "NABATS", name: "Narragansett Bay Time Series" },
];

const dataAcronyms = [
  {
    variable: "Chlorophyll",
    units: "µg L-1 or RFU",
    description: "Concentration of chlorophyll in sea water",
  },
  {
    variable: "Depth",
    units: "m",
    description: "Measured water depth under buoy",
  },
  {
    variable: "NitrateN",
    units: "mg L-1",
    description: "Concentration of nitrate in sea water, Moles",
  },
  {
    variable: "O2",
    units: "mg L-1",
    description: "Concentration of oxygen in sea water",
  },
  {
    variable: "O2Percent",
    units: "%",
    description: "Percent oxygen in sea water",
  },
  {
    variable: "pH",
    units: "SU",
    description: "Potential hydrogen in sea water, standard pH scale",
  },
  {
    variable: "Phycoerythrin",
    units: "µg L-1 or RFU",
    description: "Concentration of phycoerythrin in sea water",
  },
  {
    variable: "Salinity",
    units: "g kg-1",
    description: "Salinity of sea water, Practical Salinity Units",
  },
  {
    variable: "SpCond",
    units: "mS cm-1",
    description: "Conductivity of sea water, MilliSiemens",
  },
  {
    variable: "WaterTemp",
    units: "°C",
    description: "Sea water temperature in degrees Celsius",
  },
  {
    variable: "Turbidity",
    units: "NTU",
    description:
      "Sea water clarity measured with white light at 90° detection angle",
  },
  {
    variable: "FSpercent",
    units: "% full scale",
    description: "Total fluorescence of chlorophyll in sea water",
  },
  {
    variable: "Density",
    units: "g cm-3",
    description: "Density of sea water",
  },
  {
    variable: "DIN",
    units: "µmole L-1",
    description: "Dissolved inorganic nitrogen in sea water, Moles",
  },
  {
    variable: "DIP",
    units: "µmole L-1",
    description: "Dissolved inorganic phosphorus in sea water, Moles",
  },
  {
    variable: "NH4",
    units: "µmole L-1",
    description: "Concentration of ammonium in sea water, Moles",
  },
  {
    variable: "NO2",
    units: "µmole L-1",
    description: "Concentration of nitrite in sea water, Moles",
  },
  {
    variable: "NO3",
    units: "µmole L-1",
    description: "Concentration of nitrate in sea water, Moles",
  },
  {
    variable: "Phaeo",
    units: "µg L-1",
    description: "Concentration of phaeopigment in sea water",
  },
  {
    variable: "Silica",
    units: "µmole L-1",
    description: "Concentration of silica in sea water, Moles",
  },
];

agencyAcronyms.sort(sortByProperty("acronym"));
modelAcronyms.sort(sortByProperty("acronym"));
dataAcronyms.sort(sortByProperty("variable"));
</script>
