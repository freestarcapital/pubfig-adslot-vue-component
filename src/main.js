import Vue from 'vue';
import App from './app.vue';
import FreestarAdSlot from './index';

Vue.use(FreestarAdSlot, { publisher: 'gardeningknowhow' });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
