import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Townie from './pages/Townie.vue';

export const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: '/', component: Home },
    { path: '/project/:id', component: Townie },
  ],
})
