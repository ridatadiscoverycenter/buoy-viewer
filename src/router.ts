import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import { isEqual } from "lodash/lang";

import HomePage from "@/views/HomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import DatasetPage from "@/views/datasets/index.vue";

// TODO-QUESTION: route nuxt-style paths to new-style?
type Dataset = "fish" | "ma-buoy" | "osom" | "plankton" | "ri-buoy";

const updateQueryParams = ({ path, query }) => {
  const newQuery = (({ ids, variables, start, end }) => {
    return {
      ids: ids ?? query.buoyIds,
      variables,
      start: start.slice(0, 10),
      end: end.slice(0, 10),
    };
  })(query);

  // if the query is already valid, allow navigation
  return isEqual(newQuery, query) ? true : { path, query: newQuery };
};

// use relative paths instead of `@` due to https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const getDatasetRoutes = (
  dataset: Dataset,
  title: string,
  oldPath?: string
): RouteRecordRaw[] => {
  const redirectChildren = oldPath
    ? [
        { path: oldPath, redirect: `/dataset/${dataset}/summary` },
        {
          path: `${oldPath}/dashboard`,
          redirect: `/dataset/${dataset}/dashboard`,
        },
      ]
    : [];
  return [
    {
      path: dataset,
      component: () => import(`./views/datasets/${dataset}/index.vue`),
      children: [
        {
          path: "summary",
          name: `${title} - Summary`,
          component: () => import(`./views/datasets/${dataset}/summary.vue`),
        },
        {
          path: "dashboard",
          name: `${title} - Dashboard`,
          component: () => import(`./views/datasets/${dataset}/dashboard.vue`),
          beforeEnter: [updateQueryParams],
        },
        {
          path: "",
          redirect: `summary`,
        },
      ],
    },
    ...redirectChildren,
  ];
};

const routes: RouteRecordRaw[] = [
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
    alias: "/datasets", // for backwards compatibility with buoy-viewer-nuxt
    component: DatasetPage,
    children: [
      {
        path: "",
        redirect: "/dataset/ri-buoy/summary",
      },
      ...getDatasetRoutes("fish", "Fish Trawl Survey"),
      ...getDatasetRoutes("ma-buoy", "Historical MA Buoy Data", "ma-buoy-data"),
      ...getDatasetRoutes("osom", "Ocean State Ocean Model", "osom-data"),
      ...getDatasetRoutes("plankton", "Plankton Time Series"),
      ...getDatasetRoutes(
        "ri-buoy",
        "Historical RI Buoy Data",
        "historical-buoy-data"
      ),
      {
        path: "domoic-acid",
        name: "Domoic Acid",
        component: () => import("./views/datasets/domoic-acid/index.vue"),
      },
    ],
  },

  // catch all redirect
  { path: "/:pathMatch(.*)", redirect: "/" },
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
