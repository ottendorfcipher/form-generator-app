import { createRouter, createWebHistory } from 'vue-router'
import Admin from './views/Admin.vue'
import Form from './views/Form.vue'

const routes = [
  {
    path: '/',
    name: 'Form',
    component: Form
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
