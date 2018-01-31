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


Vue.mixin({
  methods: {
    toISODateFormat(date) {
      return new Date(date).toISOString().slice(0,10);
    },
    invoiceDueMessage(invoiceDueDate){
      let milisecondsInADay = 1000 * 60 * 60 * 24;
      let today = new Date().toISOString().slice(0,10);
      let dueDate = (new Date(today) - new Date(invoiceDueDate)) / milisecondsInADay;
      console.log("TODAY'S DATE:", today);
      return dueDate < 0 ? `${dueDate * (-1)} days until due date` : `${dueDate} days past due`;
    }
  }
})
new Vue({
  store: store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
