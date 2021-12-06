import { ref, Ref, computed, onMounted, onUnmounted, watch } from "vue";
import embed from "vega-embed";
import { View } from "vega";

export function useVega({
  spec,
  minWidth = ref(180),
  maxWidth = ref(2000),
  includeActions = ref(false),
  hasData = ref(true),
  el,
}: {
  spec: Ref<object>;
  minWidth: Ref<number>;
  maxWidth: Ref<number>;
  includeActions: Ref<boolean>;
  hasData: Ref<boolean>;
  el: Ref<HTMLDivElement | null>;
}) {
  const actionsWidth = computed(() => (includeActions.value ? 38 : 0));

  const view: Ref<null | View> = ref(null);

  const getWidth = () => {
    if (el.value?.parentElement) {
      return Math.min(
        maxWidth.value,
        Math.max(
          minWidth.value,
          Math.min(el.value.parentElement.clientWidth, window.innerWidth)
        ) - actionsWidth.value
      );
    }
    return minWidth.value;
  };

  const resizePlot = () => {
    if (view.value) {
      view.value.width(getWidth()).resize().run();
    }
  };

  let timeout: number;

  const resizeObserver = new ResizeObserver(() => {
    // If there's a timer, cancel it
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      // Run our resize functions
      resizePlot();
    }, 100);
  });

  const updatePlot = () => {
    if (view.value) {
      view.value.finalize();
    }

    console.log(spec.value);

    // don't try to render if we don't have data yet
    if (!hasData.value) return;

    // no element to render into yet
    if (!el.value) return;

    embed(el.value, spec.value, {
      actions: includeActions.value,
      theme: "vox",
      renderer: "svg",
      config: {
        background: null,
        autosize: "fit",
      },
      width: getWidth(),
    })
      .then((res) => {
        view.value = res.view;
      })
      .catch((err) => {
        // eslint disable-next-line no-console
        console.log(err);
      });
  };

  const finalize = () => {
    if (view.value) {
      view.value.finalize();
    }
    if (el.value?.parentElement) {
      resizeObserver.unobserve(el.value.parentElement);
    }
  };

  // lifecycle hooks
  onMounted(updatePlot);
  onMounted(
    () =>
      el.value?.parentElement && resizeObserver.observe(el.value.parentElement)
  );
  watch(spec, updatePlot);
  onUnmounted(finalize);

  return {
    view,
  };
}
