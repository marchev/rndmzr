import Vue from 'vue'
import Vuex from 'vuex'

import { getField, updateField } from 'vuex-map-fields'

import 'chrome-extension-async/chrome-extension-async'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: '',
    apiKey: ''
  },
  getters: {
    getField
  },
  mutations: {
    updateField
  },
  actions: {
    async loadProfile(context) {
      const { profile } = await chrome.storage.sync.get('profile')
      context.commit('updateField', { path: 'profile', value: profile })
    },
    async updateProfile(context, profile) {
      await chrome.storage.sync.set({ profile })
      context.commit('updateField', { path: 'profile', value: profile })
    },
    async loadApiKey(context) {
      const { apiKey } = await chrome.storage.sync.get('apiKey')
      context.commit('updateField', { path: 'apiKey', value: apiKey })
    },
    async updateApiKey(context, apiKey) {
      await chrome.storage.sync.set({ apiKey })
      context.commit('updateField', { path: 'apiKey', value: apiKey })
    }
  },
  modules: {
  }
})
