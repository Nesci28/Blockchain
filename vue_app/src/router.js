import Vue from 'vue';
import Router from 'vue-router';

import Blockchain from './views/Blockchain.vue';
import Home from './views/Home.vue';
import Search from './views/Search.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/search/:id',
      name: 'search',
      component: Search,
    },
    {
      path: '/blockchain',
      name: 'blockchain',
      component: Blockchain,
    },
  ],
});
