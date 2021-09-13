import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import About from '@/views/About.vue'
import CircuitSimulator from '@/views/CircuitSimulator.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'About',
    component: About
  },
  {
    path: '/circuit-simulator',
    name: 'CircuitSimulator',
    component: CircuitSimulator
  }
]

const router = new VueRouter({
  routes
})

export default router
