<template>
  <legend>
    <slot name="title" class="is-size-6"></slot>
    <slot class="is-size-7"></slot>
  </legend>
</template>

<style scoped>
legend {
  position: absolute;
  top: 4px;
  left: 4px;

  height: 220px;

  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  line-height: 28px;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
  background: #fff;
  opacity: 0.75;

  overflow: auto;
}
</style>
