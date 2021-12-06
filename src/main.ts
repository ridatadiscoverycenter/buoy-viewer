import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";

import router from "./router";

// general styling
import "@/assets/styles/main.scss";
import "../node_modules/vue-multiselect/dist/vue-multiselect.css";
import "../node_modules/vue2-datepicker/index.css";

createApp(App).use(router).use(createPinia()).mount("#app");
