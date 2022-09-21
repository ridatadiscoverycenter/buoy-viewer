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
  <div id="legend" class="map-overlay"></div>
  <!-- reference images for mapbox to pull from -->
  <img
    ref="imageEl"
    :src="BuoyMarker"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed0Image"
    :src="WindSpeed0"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed1Image"
    :src="WindSpeed1"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed2Image"
    :src="WindSpeed2"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed3Image"
    :src="WindSpeed3"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed4Image"
    :src="WindSpeed4"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed5Image"
    :src="WindSpeed5"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed6Image"
    :src="WindSpeed6"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed7Image"
    :src="WindSpeed7"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed8Image"
    :src="WindSpeed8"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed9Image"
    :src="WindSpeed9"
    style="visibility: hidden; position: absolute; top: 0"
  />

  <img
    ref="windSpeed10Image"
    :src="WindSpeed10"
    style="visibility: hidden; position: absolute; top: 0"
  />
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from "vue";
import mapboxgl from "mapbox-gl";
import { scaleSqrt, scaleLinear } from "d3-scale";
// import legend from "d3-svg-legend";
// import { select, selectAll } from "d3-selection";

import BuoyMarker from "@/assets/illustrations/buoy-marker.svg";

import WindSpeed0 from "@/assets/illustrations/wind_speed_00.svg";
import WindSpeed1 from "@/assets/illustrations/wind_speed_01.svg";
import WindSpeed2 from "@/assets/illustrations/wind_speed_02.svg";
import WindSpeed3 from "@/assets/illustrations/wind_speed_03.svg";
import WindSpeed4 from "@/assets/illustrations/wind_speed_04.svg";
import WindSpeed5 from "@/assets/illustrations/wind_speed_05.svg";
import WindSpeed6 from "@/assets/illustrations/wind_speed_06.svg";
import WindSpeed7 from "@/assets/illustrations/wind_speed_07.svg";
import WindSpeed8 from "@/assets/illustrations/wind_speed_08.svg";
import WindSpeed9 from "@/assets/illustrations/wind_speed_09.svg";
import WindSpeed10 from "@/assets/illustrations/wind_speed_10.svg";

import { Data } from "../../utils/erddap";
import { BuoyStore } from "../../store/buoy";

interface Sample extends Data {
  date: Date;
}

const store = inject("store") as BuoyStore;

const props = defineProps<{
  samples: Sample[];
  formattedDate: string;
  showChlorophyll?: boolean;
  showWind?: boolean;
}>();

const config = {
  chlorophyll: {
    varDomain: [0, 5, 15, 30],
    markerSize: [0.2, 0.75],
    markerColors: ["#7CFC00", "#4CBB17", "#008000", "#355E3B"], // grass green, kelly green, green, hunter green
  },
};

const knotsPerMS = 1.94384;
const windSpeedBinsKnots = [
  0, 2.5, 7.5, 12.5, 17.5, 22.5, 27.5, 32.5, 37.5, 42.5, 47.5, 52.5,
]; // cutoffs in knots

const annotatedChlorophyllSamples = computed(() => {
  if (props.showChlorophyll) {
    const { varDomain, markerSize, markerColors } = config.chlorophyll;
    const domain = varDomain;
    const sqrtScale = scaleSqrt().domain(domain).range(markerSize);
    const colorScale = scaleLinear()
      .domain(domain)
      .range(markerColors)
      .clamp(true);
    return props.samples
      .filter((row) => row.variable === "ChlorophyllSurface")
      .map((row) => {
        return {
          ...row,
          color: colorScale(row.value),
          size: sqrtScale(row.value),
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
const windSpeed0Image = ref<HTMLImageElement>(null);
const windSpeed1Image = ref<HTMLImageElement>(null);
const windSpeed2Image = ref<HTMLImageElement>(null);
const windSpeed3Image = ref<HTMLImageElement>(null);
const windSpeed4Image = ref<HTMLImageElement>(null);
const windSpeed5Image = ref<HTMLImageElement>(null);
const windSpeed6Image = ref<HTMLImageElement>(null);
const windSpeed7Image = ref<HTMLImageElement>(null);
const windSpeed8Image = ref<HTMLImageElement>(null);
const windSpeed9Image = ref<HTMLImageElement>(null);
const windSpeed10Image = ref<HTMLImageElement>(null);

const map = ref(null);
const geoJSON = computed(() => {
  return {
    type: "geojson",
    data: {
      id: "buoy",
      type: "FeatureCollection",
      features: store.coordinates.map(
        ({ latitude, longitude, station_name }) => {
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
                }).value / knotsPerMS,
              windDirection: annotatedWindDir.value.find((w) => {
                return w.station_name === station_name;
              }).value,
            },
          };
        }
      ),
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
    map.value.addImage("buoy-marker", imageEl.value);
    map.value.addImage("wind-speed-0", windSpeed0Image.value);
    map.value.addImage("wind-speed-1", windSpeed1Image.value);
    map.value.addImage("wind-speed-2", windSpeed2Image.value);
    map.value.addImage("wind-speed-3", windSpeed3Image.value);
    map.value.addImage("wind-speed-4", windSpeed4Image.value);
    map.value.addImage("wind-speed-5", windSpeed5Image.value);
    map.value.addImage("wind-speed-6", windSpeed6Image.value);
    map.value.addImage("wind-speed-7", windSpeed7Image.value);
    map.value.addImage("wind-speed-8", windSpeed8Image.value);
    map.value.addImage("wind-speed-9", windSpeed9Image.value);
    map.value.addImage("wind-speed-10", windSpeed10Image.value);

    updateMap();

    const legend = document.getElementById("legend");
    const legendClasses = ["0 - 5", "5 - 15", "15 - 30", "> 30"];
    const legendColors = ["#7CFC00", "#4CBB17", "#008000", "#355E3B"];
    legendClasses.forEach((legendClasses, i) => {
      const color = legendColors[i];
      const item = document.createElement("div");
      const key = document.createElement("span");
      key.className = "legend-key";
      key.style.backgroundColor = color;

      const value = document.createElement("span");
      value.innerHTML = `${legendClasses}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    });
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
        "icon-image": `wind-speed-${b + 1}`, //mapped value of wind
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

  annotatedChlorophyllSamples.value.forEach(({ color, size, station_name }) => {
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

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  opacity: 0.65;
  margin-top: 5px;
  margin-left: 5px;
  overflow: auto;
  border-radius: 3px;
}

#legend {
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
  line-height: 28px;
  height: 150px;
  margin-bottom: 40px;
  width: 120px;
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
