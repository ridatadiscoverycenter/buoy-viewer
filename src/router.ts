import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import { isEqual } from "lodash/lang";

import HomePage from "@/views/HomePage.vue";
import AboutPage from "@/views/AboutPage.vue";
import GlossaryPage from "@/views/GlossaryPage.vue";
import DatasetPage from "@/views/datasets/datasetIndex.vue";

type Dataset =
  | "fish"
  | "ma-buoy"
  | "osom"
  | "plankton"
  | "ri-buoy"
  | "buoy-telemetry";

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
const getBuoyDatasetRoutes = (
  dataset: Dataset,
  title: string,
  oldPath?: string,
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
      component: () =>
        import(`./views/datasets/${dataset}/${dataset}Index.vue`),
      children: [
        {
          path: "summary",
          name: `${title} - Summary`,
          component: () =>
            import(`./views/datasets/${dataset}/${dataset}Summary.vue`),
        },
        {
          path: "dashboard",
          name: `${title} - Dashboard`,
          component: () =>
            import(`./views/datasets/${dataset}/${dataset}Dashboard.vue`),
          beforeEnter: [updateQueryParams],
        },
        {
          path: "",
          redirect: `/dataset/${dataset}/summary`,
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
    path: "/glossary",
    name: "Glossary",
    component: GlossaryPage,
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
      ...getBuoyDatasetRoutes(
        "ma-buoy",
        "Historical MA Buoy Data",
        "ma-buoy-data",
      ),
      ...getBuoyDatasetRoutes("osom", "Ocean State Ocean Model", "osom-data"),
      ...getBuoyDatasetRoutes("plankton", "Plankton Time Series"),
      ...getBuoyDatasetRoutes(
        "ri-buoy",
        "Historical RI Buoy Data",
        "historical-buoy-data",
      ),
      ...getBuoyDatasetRoutes("buoy-telemetry", "Real Time Buoys"),
      {
        path: "fish",
        component: () => import(`./views/datasets/fish/fishIndex.vue`),
        children: [
          {
            path: "summary",
            name: `Fish Trawl Survey - Summary`,
            component: () => import(`./views/datasets/fish/fishSummary.vue`),
          },
          {
            path: "dashboard",
            name: `Fish Trawl Survey - Dashboard`,
            component: () => import(`./views/datasets/fish/fishDashboard.vue`),
          },
          {
            path: "",
            redirect: `/dataset/fish/summary`,
          },
        ],
      },
      {
        path: "domoic-acid",
        name: "Domoic Acid",
        component: () =>
          import("./views/datasets/domoic-acid/domoic-acidIndex.vue"),
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
