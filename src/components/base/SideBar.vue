<template>
  <div>
    <div class="has-text-right">
      <button type="button" class="button bars" @click="toggle">
        <i v-if="!collapsed" class="fas fa-times" />
        <i v-else class="fas fa-bars" />
      </button>
    </div>
    <div class="sidebar-body">
      <p v-if="!collapsed" class="menu-label">Narragansett Bay Data Explorer</p>
      <p v-else class="menu-label">
        <abbr title="Narragansett Bay Data Explorer">NBDE</abbr>
      </p>
      <ul class="menu-list">
        <li>
          <router-link to="/">
            <i class="fas fa-home" />
            <span v-if="!collapsed">Home</span>
          </router-link>
        </li>
        <!-- TODO: about page -->
        <!-- <li>
          <nuxt-link
            :to="{
              name: 'about',
            }"
          >
            <i class="fas fa-info-circle" />
            <span v-if="!collapsed">About</span></nuxt-link
          >
        </li> -->
      </ul>
      <p v-if="!collapsed" class="menu-label">Exploration Datasets</p>
      <p v-else class="menu-label">
        <abbr title="Exploration Datasets">DATA</abbr>
      </p>
      <ul class="menu-list">
        <li v-for="item in DATASETS" :key="item.route">
          <div v-if="item.available">{ item}</div>
          <!-- <router-link
            v-if="item.available"
            :class="{ 'is-active': route === item.route }"
            :aria-disabled="!item.available"
            :to="{
              name: item.route,
            }"
          >
            <span v-if="!collapsed">{{ item.name }}</span>
            <span v-else
              ><abbr :title="item.name" class="collapsed-flex-item">
                <fa :icon="['fas', 'poll']" class="mr-1" />
                <span>{{ initials(item.name) }}</span>
              </abbr></span
            >
          </router-link> -->
          <a
            v-else
            disabled
            :aria-disabled="!item.available"
            class="not-allowed-cursor"
          >
            <span v-if="!collapsed">{{ item.name }}</span>
            <span v-else
              ><abbr :title="item.name" class="collapsed-flex-item">
                <i class="fas fa-poll mr-1" />
                <span>{{ initials(item.name) }}</span>
              </abbr></span
            >
            <span v-if="!collapsed" class="tag is-light is-warning ml-2"
              >coming soon</span
            ></a
          >
        </li>
      </ul>
      <p v-if="!collapsed" class="menu-label">Resources</p>
      <p v-else class="menu-label">
        <abbr title="Resources">Src</abbr>
      </p>
      <ul class="menu-list">
        <li>
          <a href="https://pricaimcit.services.brown.edu/erddap/index.html">
            <span v-if="!collapsed">
              <i class="fas fa-database mr-1" />
              ERDDAP Server</span
            >
            <span v-else>
              <abbr title="ERDDAP Server" class="collapsed-flex-item">
                <i class="fas fa-database mr-1" />
                <span> {{ initials("ERDDAP Server") }}</span>
              </abbr></span
            >
          </a>
        </li>
        <li>
          <a href="https://ridatadiscovery.org">
            <span v-if="!collapsed"
              ><abbr title="Rhode Island Data Discovery Center"
                ><i class="fas fa-water mr-1" />RIDDC</abbr
              >
              Home</span
            >
            <span v-else>
              <abbr
                title="Rhode Island Data Discovery Center Home"
                class="collapsed-flex-item"
              >
                <i class="fas fa-water mr-1" />
                <span> {{ initials("RIDDC Home") }}</span>
              </abbr></span
            ></a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["toggle"]);

const initials = (str) => {
  return str
    .split(" ")
    .map((s) => s[0].toUpperCase())
    .join("");
};

const collapsed = ref(false);

const DATASETS = [
  {
    name: "RI Buoy Data",
    route: "datasets-historical-buoy-data",
    available: true,
  },
  {
    name: "MA Buoy Data",
    route: "datasets-ma-buoy-data",
    available: true,
  },
  {
    name: "Ocean State Ocean Model",
    route: "datasets-osom-data",
    available: true,
  },
  {
    name: "Plankton Time Series",
    route: "datasets-plankton",
    available: true,
  },
  {
    name: "Domoic Acid",
    route: "datasets-domoic-acid",
    available: true,
  },
  {
    name: "Fish Trawl Survey",
    route: "datasets-fish",
    available: true,
  },
];

const toggle = () => {
  collapsed.value = !collapsed.value;
  return emit("toggle", collapsed.value);
};

// export default {
//   // to determine the active route
//   computed: {
//     route() {
//       return this.$route.name.replace('-dashboard', '');
//     },
//   },
// };
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.is-active {
  background-color: $primary !important;
}
.not-allowed-cursor {
  cursor: not-allowed;
}
.bars {
  border: none !important;
  background-color: whitesmoke !important;
}
.collapsed-flex-item {
  display: flex;
  align-items: center;
  justify-items: center;
  margin-left: -0.35rem;
  span {
    font-size: 0.6rem;
  }
}
</style>
