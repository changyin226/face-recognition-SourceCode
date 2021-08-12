import Vue from 'vue';
import VueParticles from 'vue-particles';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Notifications from 'vue-notification';
import App from './App.vue';
import router from './router';
import '@/bus';

Vue.use(VueAxios, axios);
Vue.use(VueParticles);
Vue.use(Notifications);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
