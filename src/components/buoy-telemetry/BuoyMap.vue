<template>
  <div class="mapboxgl-map-container">
    <div class="date is-hidden-touch is-size-4">
      <span>{{ formattedDate }}</span>
    </div>
    <div class="date-mobile is-hidden-desktop is-size-5">
      <span>{{ formattedDate }}</span>
    </div>
    <div ref="el" class="mapbox-container" />
  </div>
  <MapLegend>
    <template #title>
      <strong class="is-size-6">Water Temp (&deg;C)</strong>
    </template>

    <ul>
      <li v-for="(temp, i) in config.waterTemp.varDomain" :key="temp">
        <span
          class="legend-key"
          :style="{ backgroundColor: config.waterTemp.markerColors[i] }"
        ></span>
        <span v-if="i === config.waterTemp.varDomain.length - 1">> {{ temp }}</span>
        <span v-else>{{ temp }} - {{ config.waterTemp.varDomain[i + 1] }}</span>
      </li>
    </ul>
  </MapLegend>
  <!-- reference images for mapbox to pull from -->
  <img ref="imageEl" :src="BuoyMarker" style="visibility: hidden; position: absolute; top: 0" />
  <template v-if="map !== null">
    <MapImage :map name="buoy-marker" :src="BuoyMarker" />
    <MapImage v-for="{ name, src } in WINDSPEED_MARKERS" :key="name" :map :name="name" :src="src" />
  </template>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import mapboxgl from "mapbox-gl";
import { scaleLog } from "d3-scale";
import { WINDSPEED_MARKERS } from "./windspeedMarkers";

import BuoyMarker from "@/assets/illustrations/buoy-marker.svg";
import MapImage from "../map/MapImage.vue";
import MapLegend from "../map/MapLegend.vue";

import { type Data } from "../../utils/erddap";
import { type BuoyStore } from "../../store/buoy";

interface Sample extends Data {
  date: Date;
}

const store = inject("store") as BuoyStore;

const props = defineProps<{
  samples: Sample[];
  formattedDate: string;
  showWaterTemp?: boolean;
  showWind?: boolean;
}>();

const config = {
  waterTemp: {
    varDomain: [2.17, 5.0, 7.85, 10.65, 13.52], //[0.1, 1, 10, 100, 1000, 10000],
    markerSize: [0.05, 0.4],
    markerColors: [
      "#4863A0",
      "#3BB9FF",
      "#8EEBEC",
      "#FFDF00",
      "#F88017",
      // warmer temps = red, cooler temps = blue
      // azure blue, midday blue, blue lagoon, golden yellow, carrot orange
    ],
  },
};

const knotsPerMS = 1.94384;
const windSpeedBinsKnots = [0, 2.5, 7.5, 12.5, 17.5, 22.5, 27.5, 32.5, 37.5, 42.5, 47.5, 52.5]; // cutoffs in knots

const annotatedWaterTempSamples = computed(() => {
  if (props.showWaterTemp) {
    const { varDomain, markerSize, markerColors } = config.waterTemp;
    const domain = varDomain;
    const logScale = scaleLog().domain(domain).range(markerSize);
    const colorScale = scaleLog().domain(domain).range(markerColors).clamp(true);
    return props.samples
      .filter((row) => row.variable === "WaterTempSurface")
      .map((row) => {
        return {
          ...row,
          color: colorScale(row.value),
          size: logScale(row.value),
        };
      });
  } else {
    return [];
  }
});

const annotatedWindSpeedms = computed(() => {
  if (props.showWind) {
    return props.samples.filter((row) => row.variable === "WindSpeedAverage");
  } else {
    return [];
  }
});

const annotatedWindDir = computed(() => {
  if (props.showWind) {
    return props.samples.filter((row) => row.variable === "WindDirectionFrom");
  } else {
    return [];
  }
});

const el = ref<HTMLDivElement>(null);
const imageEl = ref<HTMLImageElement>(null);

const map = ref(null);
const geoJSON = computed(() => {
  return {
    type: "geojson",
    data: {
      id: "buoy",
      type: "FeatureCollection",
      features: store.coordinates.map(({ latitude, longitude, station_name }) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          properties: {
            windSpeed:
              annotatedWindSpeedms.value.find((w) => {
                return w.station_name === station_name;
              })?.value / knotsPerMS,
            windDirection: annotatedWindDir.value.find((w) => {
              return w.station_name === station_name;
            })?.value,
          },
        };
      }),
    },
  };
});

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  map.value = new mapboxgl.Map({
    container: el.value,
    style: "mapbox://styles/ccv-bot/ckmxra8oi0rsw17mzcbqrktzi",
    center: [-71.35, 41.517],
    zoom: 9.1,
    // centered with anticipation of the third buoy south of Newport
    doubleClickZoom: false,
    scrollZoom: false,
  });

  map.value.on("load", function () {
    map.value.resize();
    // map.value.addImage("buoy-marker", imageEl.value);

    updateMap();
  });
});

let markers = [];
const updateMap = () => {
  for (var b = 0; b < windSpeedBinsKnots.length - 1; b++) {
    if (map.value.getLayer("svgfile" + b)) {
      map.value.removeLayer("svgfile" + b);
    }
  }
  if (map.value.getLayer("points")) {
    map.value.removeLayer("points");
  }
  if (map.value.getSource("points")) {
    map.value.removeSource("points");
  }
  map.value.addSource("points", geoJSON.value);
  map.value.addLayer({
    id: "points",
    type: "symbol",
    source: "points",
    layout: {
      "icon-allow-overlap": true,
      "icon-image": "buoy-marker",
      "icon-size": 0.9,
      "icon-offset": [0.8, -4], // optically centered
    },
  });
  for (var b = 0; b < windSpeedBinsKnots.length - 1; b++) {
    map.value.addLayer({
      id: "svgfile" + b,
      type: "symbol",
      filter: [
        "all",
        [">=", "windSpeed", windSpeedBinsKnots[b]],
        ["<", "windSpeed", windSpeedBinsKnots[b + 1]],
      ],
      source: "points",
      layout: {
        "icon-allow-overlap": true,
        "icon-image": `windspeed-${b + 1}`, //mapped value of wind
        "icon-offset": [-100, -40], // optically centered
        "icon-size": 0.3,
        "icon-rotate": {
          property: "windDirection",
          stops: [
            [0, 90],
            [270, 360],
          ],
        },
      },
    });
  }
  markers.forEach((marker) => {
    marker._element.remove();
    marker.remove();
  });
  markers = [];

  annotatedWaterTempSamples.value.forEach(({ color, size, station_name }) => {
    // create circle elements to display
    const elementSize = `${100 * size}px`;
    const el = document.createElement("div");
    el.className = "marker";
    el.style.width = elementSize;
    el.style.height = elementSize;
    el.style.backgroundColor = color;
    el.style.opacity = "0.6";
    el.style.borderRadius = "100%";

    markers.push(
      new mapboxgl.Marker({ element: el })
        .setLngLat(store.siteCoordinates(station_name))
        .setPopup(new mapboxgl.Popup().setText(station_name))
        .addTo(map.value)
    );
  });
};
watch(() => props.formattedDate, updateMap);
</script>

<style lang="scss" scoped>
.mapboxgl-map-container {
  height: min(70vh, 400px);
  width: 100%;
  position: relative;
}
.date {
  font-size: 2.5rem;
  font-weight: bold;
  padding: 2rem;
  position: absolute;
  text-align: right;
  width: 100%;
  z-index: 10;
  box-sizing: border-box;
}
.date-mobile {
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1rem;
  position: absolute;
  text-align: right;
  width: 100%;
  z-index: 10;
  box-sizing: border-box;
}
.mapbox-container {
  height: 100%;
}

/* prettier-ignore */
:deep(.legend-key){
  display: inline-block;
  border-radius: 20%;
  width: 10px;
  height: 10px;
  margin-right: 5px;
}
</style>
