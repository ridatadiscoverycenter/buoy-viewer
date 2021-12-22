<template>
  <div class="mapboxgl-map-container">
    <div class="date is-hidden-touch">
      <span>{{ formattedDate }}</span>
    </div>
    <div class="date-mobile is-hidden-desktop">
      <span>{{ formattedDate }}</span>
    </div>
    <div ref="el" />

    <!-- <MglMap
        v-model:center="mapCenter"
        :access-token="accessToken"
        :map-style="mapStyle"
        :zoom="9"
        :scroll-zoom="false"
      >
        <div v-for="(point, index) in activeCoordinates" :key="index">
          <MglMarker :coordinates="[point.longitude, point.latitude]">
            <BuoyMarker slot="marker" />
            <MglPopup> {{ point.station_name }}</MglPopup>
          </MglMarker>
        </div>
        <MglGeojsonLayer
          :layer="geoJsonlayer"
          :layer-id="geoJsonlayer.id"
          source-id="buoy"
          :source="selectedSamplesGeoJSON"
        />
      </MglMap> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import BuoyMarker from "@/assets/illustrations/buoy-marker.svg?inline";

import mapboxgl from "mapbox-gl";

const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
});

const el = ref<HTMLDivElement>(null);
onMounted(() => {
  mapboxgl.accessToken = import.meta.VITE_MAPBOX_ACCESS_TOKEN;

  new mapboxgl.Map({
    container: el,
    style: "mapbox://styles/ccv-bot/ckmxra8oi0rsw17mzcbqrktzi",
    center: [-71.46, 41.5],
    zoom: 9,
    doubleClickZoom: false,
    scrollZoom: false,
  });
});

const formattedDate = computed(() => props.date.toLocaleDateString());
</script>

<style lang="sass" scoped>
.mapboxgl-map-container
  height: 70vh
  width: 100%
  position: relative

.date
  font-size: 2.5rem
  font-weight: bold
  padding: 2rem
  position: absolute
  text-align: right
  width: 100%
  z-index: 10
  box-sizing: border-box

.date-mobile
  font-size: 1.25rem
  font-weight: bold
  padding: 1rem
  position: absolute
  text-align: right
  width: 100%
  z-index: 10
  box-sizing: border-box
</style>

<style lang="sass">
.mapboxgl-marker
  height: 1.2rem
  path
    fill: hsla(0deg, 0%, 20%, 80%)
</style>
