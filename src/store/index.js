import Vue from 'vue'
import Vuex from 'vuex'

import { getField, updateField } from 'vuex-map-fields'

import 'chrome-extension-async/chrome-extension-async'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: '',
    projects: []
  },
  getters: {
    getField
  },
  mutations: {
    updateField
  },
  actions: {
    async loadProfile({ commit }) {
      const { profile } = await chrome.storage.sync.get('profile')
      commit('updateField', { path: 'profile', value: profile })
    },
    async loadProjects({ commit }) {
      const { projects } = await chrome.storage.sync.get('projects')
      if (projects !== undefined) {
        // Commit only if any projects have been loaded
        commit('updateField', { path: 'projects', value: projects })
      }
    },
    async addProject({ commit, state }, project) {
      const projects = [...state.projects]
      const existing = projects.find(item => item.id === project.id)

      if (existing === undefined) {
        projects.push(project)
        commit('updateField', { path: 'projects', value: projects })
        await chrome.storage.sync.set({ projects })
        console.log(`New project added: project=${JSON.stringify(project)}`)
      } else {
        console.log(`Project already exists, skipped: project=${JSON.stringify(project)}`)
      }
    },
    async removeProject({ commit, state }, project) {
      let projects = [...state.projects].filter(item => item.id !== project.id)
      commit('updateField', { path: 'projects', value: projects })
      await chrome.storage.sync.set({ projects })
      console.log(`Project removed: project=${JSON.stringify(project)}`)
    }
  }
})
