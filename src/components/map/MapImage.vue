<template>
  <img ref="imageElement" :src />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Map } from "mapbox-gl";

const { map, name, src } = defineProps<{
  map: Map;
  name: string;
  src: string;
}>();

const imageElement = ref<HTMLImageElement>(null);

onMounted(() => {
  if (map.loaded()) {
    map.addImage(name, imageElement.value);
  } else {
    map.on("load", () => {
      map.addImage(name, imageElement.value);
    });
  }
});
</script>

<style scoped>
img {
  visibility: hidden;
  position: absolute;
  top: 0;
}
</style>
