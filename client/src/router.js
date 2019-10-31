import Vue from 'vue';
import Router from 'vue-router';

import Blockchain from './views/Blockchain.vue';
import Home from './views/Home.vue';
import Search from './views/Search.vue';
import Presentation from './views/Presentation.vue';
import Laboratory from './views/Laboratory.vue';
import NotFound from './views/NotFound.vue';

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
    {
      path: '/presentation',
      name: 'presentation',
      component: Presentation,
    },
    {
      path: '/laboratory',
      name: 'laboratory',
      component: Laboratory,
    },
    {
      path: '/easter',
      name: 'notFound',
      component: NotFound,
      alias: '/*',
    },
  ],
});
