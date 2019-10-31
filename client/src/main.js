import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faClipboard,
  faFilePowerpoint,
  faFlask,
  faLink,
  faUnlink,
  faDiceD20,
  faAddressCard,
  faArrowsAlt,
  faCompressArrowsAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import VueClipboards from 'vue-clipboards';
import fullscreen from 'vue-fullscreen';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import App from './App.vue';
import router from './router';

library.add(
  faClipboard,
  faFilePowerpoint,
  faFlask,
  faLink,
  faUnlink,
  faDiceD20,
  faAddressCard,
  faArrowsAlt,
  faCompressArrowsAlt,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(fullscreen);
Vue.use(VueClipboards);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
