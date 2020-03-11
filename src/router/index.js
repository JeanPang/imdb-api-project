/* eslint-disable import/extensions */
import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import Home from '../components/Home';
import Movies from '../components/Movies';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/movies/:id',
    name: 'movies',
    component: Movies,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
