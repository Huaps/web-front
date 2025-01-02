// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    component: () => import('@/views/user/Home.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/user/About.vue'),
      },
      {
        path: 'promote',
        component: () => import('@/views/user/Promote.vue'),
      },
      {
        path: 'power',
        component: () => import('@/views/user/Power.vue')
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/user/Detail.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/Admin.vue'),
    children: [
      {
        path: '',
        redirect: '/admin/bill'
      },
      {
        path: 'bill',
        component: () => import('@/views/admin/Bill.vue')
      },
      {
        path: 'user',
        component: () => import('@/views/admin/User.vue')
      },
      {
        path: 'request',
        component: () => import('@/views/admin/Request.vue')
      },
      {
        path: 'response',
        component: () => import('@/views/admin/Response.vue')
      },
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/common/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/common/Register.vue')
  },
  {
    path: '/admin/:catchAll(.*)',
    redirect: '/admin/bill'
  },
  {
    path: '/:catchAll(.*)', redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
