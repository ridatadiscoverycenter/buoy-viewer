<template>
  <DashboardLayout>
    <DashboardCard>
      <template #title> Agencies and Organizations </template>
      <template #content>
        <div class="px-4" style="font-size: 0.95rem">
          <p v-for="agency in agencyAcronyms" :key="agency.acronym">
            <strong style="font-size: 1.02rem">{{ agency.acronym }}:</strong>
            {{ agency.name }}
          </p>
        </div>
      </template>
    </DashboardCard>
    <DashboardCard>
      <template #title>Models and Data</template>
      <template #content>
        <div class="px-4" style="font-size: 0.95rem">
          <p v-for="model in modelAcronyms" :key="model.acronym">
            <strong style="font-size: 1.02rem">{{ model.acronym }}:</strong>
            {{ model.name }}
          </p>
        </div>
      </template>
    </DashboardCard>
    <DashboardCard>
      <template #title>Data Variables</template>
      <template #content>
        <div class="px-4" style="font-size: 0.9rem">
          <p v-for="data in dataAcronyms" :key="data.variable">
            <strong style="font-size: 1.02rem">{{ data.variable }}:</strong>
            ({{ data.units }})
            {{data.description}}
          </p>
        </div>
      </template>
    </DashboardCard>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from "@/layouts/dashboard.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
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
  { acronym: "NABATS", name: "Narragansett Bay Time Series"},
];


const dataAcronyms = [
  {variable: "ChlorophyllSurface", units: "µg L-1", description: "Concentration of chlorophyll in sea water at surface, Relative Fluorescence Units"},
  {variable: "ChlorophyllBottom", units: "µg L-1", description: "Concentration of chlorophyll in sea water at bottom, Relative Fluorescence Units"},
  {variable: "depth", units: "m", description: "Topographic depth at buoy location"},
  {variable: "DepthSurface", units: "m", description: "Measured water depth under buoy"},
  {variable: "NitrateNSurface", units: "mg L-1", description: "Concentration of nitrate in sea water at surface, Moles"},
  {variable: "O2Bottom", units: "mg L-1", description: "Concentration of oxygen in sea water at bottom"},
  {variable: "O2Surface", units: "mg L-1", description: "Concentration of oxygen in sea water at surface"},
  {variable: "O2PercentBottom", units: "%", description: "Percent oxygen in sea water at bottom"},
  {variable: "O2PercentSurface", units: "%", description: "Percent oxygen in sea water at surface"},
  {variable: "pHBottom", units: "SU", description: "Potential Hydrogen in sea water at bottom, standard pH scale"},
  {variable: "pHSurface", units: "SU", description: "Potential Hydrogen in sea water at surface, standard pH scale"},
  {variable: "PhycoerythrinBottom", units: "µg L-1", description: "Concentration of phycoerythrin in sea water at bottom, Relative Fluorescence Units"},
  {variable: "PhycoerythrinSurface", units: "µg L-1", description: "Concentration of phycoerythrin in sea water at surface, Relative Fluorescence Units"},
  {variable: "SalinityBottom", units: "g kg-1", description: "Salinity of sea water at bottom, Practical Salinity Units"},
  {variable: "SalinitySurface", units: "g kg-1", description: "Salinity of sea water at surface, Practical Salinity Units"},
  {variable: "SpCondBottom", units: "mS cm-1", description: "Conductivity of sea water at bottom, MilliSiemens"},
  {variable: "SpCondSurface", units: "mS cm-1", description: "Conductivity of sea water at surface, MilliSiemens"},
  {variable: "WaterTempBottom", units: "°C", description: "Sea water temperature at bottom"},
  {variable: "WaterTempSurface", units: "°C", description: "Sea water temperature at surface"},
  {variable: "TurbidityBottom", units: "unknown", description: "Sea water turbidity at bottom"},
  {variable: "FSpercentSurface", units: "unknown", description: "unknown"},
  {variable: "DensitySurface", units: "g cm-3", description: "Density of sea water at surface"},
  {variable: "DensityBottom", units: "g cm-3", description: "Density of sea water at bottom"},
  {variable: "DINSurface", units: "µmole L-1", description: "Dissolved inorganic nitrogen in sea water at surface, Moles"},
  {variable: "DINBottom", units: "µmole L-1", description: "Dissolved inorganic nitrogen in sea water at bottom, Moles"},
  {variable: "DIPSurface", units: "µmole L-1", description: "Dissolved inorganic phosphorus in sea water at surface, Moles"},
  {variable: "DIPBottom", units: "µmole L-1", description: "Dissolved inorganic phosphorus in sea water at bottom, Moles"},
  {variable: "NH4Surface", units: "µmole L-1", description: "Concentration of ammonium in sea water at surface, Moles"},
  {variable: "NH4Bottom", units: "µmole L-1", description: "Concentration of ammonium in sea water at bottom, Moles"},
  {variable: "NO2Surface", units: "µmole L-1", description: "Concentration of nitrite in sea water at surface, Moles"},
  {variable: "NO2Bottom", units: "µmole L-1", description: "Concentration of nitrite in sea water at bottom, Moles"},
  {variable: "NO3Surface", units: "µmole L-1", description: "Concentration of nitrate in sea water at surface, Moles"},
  {variable: "NO3Bottom", units: "µmole L-1", description: "Concentration of nitrate in sea water at bottom, Moles"},
  {variable: "PhaeoSurface", units: "µg L-1", description: "Concentration of phaeopigment in sea water at surface"},
  {variable: "PhaeoBottom", units: "µg L-1", description: "Concentration of phaeopigment in sea water at bottom"},
  {variable: "SilicaSurface", units: "µmole L-1", description: "Concentration of silica in sea water at surface, Moles"},
  {variable: "SilicaBottom", units: "µmole L-1", description: "Concentration of silica in sea water at bottom, Moles"},
];

agencyAcronyms.sort(sortByProperty("acronym"));
modelAcronyms.sort(sortByProperty("acronym"));
dataAcronyms.sort(sortByProperty("variable"));
</script>
