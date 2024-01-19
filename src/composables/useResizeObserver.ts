import { onMounted, onUnmounted, Ref } from "vue";

// given an element, resize it using the callback when its parent size changes.  The resize
// callback isn't called until the debounceDuration has passed.
export function useResizeObserver(
  el: Ref<HTMLDivElement | null>,
  callback: () => void,
  debounceDuration = 100,
) {
  let timeout: number;

  const resizeObserver = new ResizeObserver(() => {
    if (timeout) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(callback, debounceDuration);
  });

  onMounted(
    () =>
      el.value?.parentElement && resizeObserver.observe(el.value.parentElement),
  );

  onUnmounted(
    () =>
      el.value?.parentElement &&
      resizeObserver.unobserve(el.value.parentElement),
  );
}
