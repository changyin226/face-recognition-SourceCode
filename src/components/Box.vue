<template>
  <div
    class="box-component"
    :style="{
      top: `${box.topRow}px`,
      right: `${box.rightCol}px`,
      bottom: `${box.bottomRow}px`,
      left: `${box.leftCol}px`
    }"
  />
</template>

<script>
export default {
  props: {
    box: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.box-component {
  position: absolute;
  border: 3px solid #149df2;
}
</style>
