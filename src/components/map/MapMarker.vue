<template>
  <div
    ref="markerElement"
    :style="{ width: `${size * 100}px`, height: `${size * 100}px`, backgroundColor: color }"
  ></div>
</template>

<script setup lang="ts">
import { Map, Marker, Popup } from "mapbox-gl";
import { onMounted, ref } from "vue";

const { map, lngLat, size, color, text } = defineProps<{
  map: Map;
  lngLat: [number, number];
  size: number;
  color: string;
  text: string;
}>();

const markerElement = ref<HTMLDivElement>(null);

onMounted(() => {
  const initMarker = () =>
    new Marker({ element: markerElement.value })
      .setLngLat(lngLat)
      .setPopup(new Popup().setText(text))
      .addTo(map);
  if (map.loaded()) {
    initMarker();
  } else {
    map.on("load", () => {
      initMarker();
    });
  }
});
</script>

<style scoped>
div {
  opacity: 60%;
  border-radius: 100%;
}
</style>
