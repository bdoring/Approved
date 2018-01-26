import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import UploadNewInvoice from '@/components/UploadNewInvoice'
import CreateVendor from '@/components/CreateVendor'
import EditVendor from '@/components/EditVendor'
import CreateUser from '@/components/CreateUser'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/new-invoice',
      name: 'UploadNewInvoice',
      component: UploadNewInvoice
    },
    {
      path: '/create-vendor',
      name: 'CreateVendor',
      component: CreateVendor
    },
    {
      path: '/edit-vendor',
      name: 'EditVendor',
      component: EditVendor
    },
    {
      path: '/create-user',
      name: 'CreateUser',
      component: CreateUser
    }
  ]
})
