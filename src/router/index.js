import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
 

  {
    path: '/personnel/:id',
    name: 'Personnel',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Personnel.vue'),
    children: [
      {
        name: 'absence_config',
        path: 'absence_config/:absenceId',
        component: () => import('../views/AbsenceConfig.vue')
      },
      {
        name: 'absence_details',
        path: 'absence_details/:absenceId',
        component: () => import('../views/AbsenceDetails.vue')
      }
    ]
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
