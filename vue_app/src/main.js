import { library } from '@fortawesome/fontawesome-svg-core';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import VueClipboards from 'vue-clipboards';

import App from './App.vue';
import router from './router';

library.add(faClipboard);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueClipboards);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
