import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/HomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import DatasetPage from "@/views/datasets/index.vue";

// TODO: route nuxt-style paths to new-style
type Dataset = "ma-buoy" | "osom" | "plankton" | "ri-buoy";

// use relative paths instead of `@` due to https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const getDatasetRoutes = (dataset: Dataset, title: string) => {
  return {
    path: dataset,
    component: () => import(`../views/datasets/${dataset}/index.vue`),
    children: [
      {
        path: "",
        redirect: `/dataset/${dataset}/summary`,
      },
      {
        path: "summary",
        name: `${title} - Summary`,
        component: () => import(`../views/datasets/${dataset}/summary.vue`),
      },
      {
        path: "dashboard",
        name: `${title} - Dashboard`,
        component: () => import(`../views/datasets/${dataset}/dashboard.vue`),
      },
    ],
  };
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
  {
    path: "/dataset",
    name: "Dataset",
    component: DatasetPage,
    children: [
      {
        path: "",
        redirect: "/dataset/ri-buoy/summary",
      },
      getDatasetRoutes("ma-buoy", "Historical MA Buoy Data"),
      getDatasetRoutes("osom", "Ocean State Ocean Model"),
      getDatasetRoutes("plankton", "Plankton Time Series"),
      getDatasetRoutes("ri-buoy", "Historical RI Buoy Data"),
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

export default router;
