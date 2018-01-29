// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/store'
import VueAxios from 'vue-axios'
import axios from 'axios'
import {
  Vuetify,
  VApp,
  VAlert,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VForm,
  VTextField,
  VSelect,
  VCheckbox,
  VDatePicker,
  VMenu,
  VCard,
  VDivider,
  VSubheader,
  VDialog,
  VBadge,
  transitions
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VAlert,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VForm,
    VTextField,
    VSelect,
    VCheckbox,
    VDatePicker,
    VMenu,
    VCard,
    VDivider,
    VSubheader,
    VDialog,
    VBadge,
    transitions
  }
})

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = 'http://localhost:8000'

Vue.config.productionTip = false

/* eslint-disable no-new */

Vue.router = router

Vue.use(require('@websanova/vue-auth'), {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  rolesVar: 'type'
})

Vue.filter('proper', value => {
  return value[0].toUpperCase() + value.slice(1).toLowerCase();
})

Vue.filter('formatDate', value => {
  const [year, month, day] = value.split('-')
  return `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`
})

Vue.filter('currencyFormat', value => {
  return Number(value).toFixed(2);
})

new Vue({
  store: store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
