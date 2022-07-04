import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
 

  {
    path: '/absence/:id',
    name: 'Absence',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Absence.vue')
  },
  {
    path:'/listabsence/:id',
    name:'ListAbsence',
    component: () => import('../views/ListAbsence.vue')
  }
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
