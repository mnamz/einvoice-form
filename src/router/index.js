import { createRouter, createWebHistory } from 'vue-router'
import InvoiceForm from '../components/InvoiceForm.vue'
import SuccessPage from '../components/SuccessPage.vue'

const routes = [
  {
    path: '/',
    name: 'InvoiceForm',
    component: InvoiceForm
  },
  {
    path: '/success',
    name: 'SuccessPage',
    component: SuccessPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

