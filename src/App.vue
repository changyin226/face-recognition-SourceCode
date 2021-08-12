<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :lock-scroll="true"
      :opacity="0.6"
      background-color="#000"
      color="#f713ff"
    />
    <notifications position="top left" />
    <navigation />
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view />
    </transition>
    <vue-particles
      color="#fff"
      :particle-opacity="1"
      :particles-number="100"
      :particle-size="1"
      lines-color="#fff"
      :line-opacity="0.8"
      :hover-effect="false"
      :click-effect="false"
    />
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    Navigation,
    Loading,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {
    this.$bus.$on('update:loading', (isLoading) => {
      this.isLoading = isLoading;
    });
  },
};
</script>

<style lang="scss">
@import './assets/stylesheet/all.scss';
</style>
