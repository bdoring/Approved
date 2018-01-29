import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import UploadNewInvoice from '@/components/UploadNewInvoice'
import CreateVendor from '@/components/CreateVendor'
import EditVendor from '@/components/EditVendor'
import CreateUser from '@/components/CreateUser'
import EditUser from '@/components/EditUser'
import HomeApprover from '@/components/HomeApprover'
import PastInvoices from '@/components/PastInvoices'
import EditYourAccount from '@/components/EditYourAccount'
import AllInvoices from '@/components/AllInvoices'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home-admin',
      name: 'Home',
      component: Home
    },
    {
      path: '/new-invoice',
      name: 'UploadNewInvoice',
      component: UploadNewInvoice
    },
    {
      path: '/all-invoices',
      name: 'AllInvoices',
      component: AllInvoices
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
    },
    {
      path: '/edit-user',
      name: 'EditUser',
      component: EditUser
    },
    {
      path: '/home-approver',
      name: 'HomeApprover',
      component: HomeApprover
    },
    {
      path: '/invoices',
      name: 'PastInvoices',
      component: PastInvoices
    },
    {
      path: '/edit-account',
      name: 'EditYourAccount',
      component: EditYourAccount
    }
  ]
})
