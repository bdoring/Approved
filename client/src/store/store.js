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
    updateInvoicesRejected: (state, payload) => {}
  },
  actions: {
    updateInvoicesPending: (context, payload) => {
      context.commit('updateInvoicesPending', payload)
    }
  }
});
