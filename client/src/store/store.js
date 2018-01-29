import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
    invoicesApproved: [],
    invoicesRejected: [],
    invoicesPending: []
  },
  mutations: {
    updateInvoicesPending: (state, payload) => {
      state.invoicesPending = payload;
    },
    updateInvoicesApproved: (state, payload) => {
      console.log('here', payload)
      state.invoicesApproved = payload;
    }
  },
  actions: {
    updateInvoicesPending: (context, payload) => {
      context.commit('updateInvoicesPending', payload)
    },
    updateInvoicesApproved: (context, payload) => {
      context.commit('updateInvoicesApproved', payload)
    }
  }
});
