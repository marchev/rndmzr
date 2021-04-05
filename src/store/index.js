import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getField, updateField } from 'vuex-map-fields';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    profile: '',
    apiKey: '',
    softSubmit: false,
    overrideMode: false,
    projects: [],
    userInfo: {}
  },
  getters: {
    getField
  },
  mutations: {
    updateField,
    addProject(state, project) {
      const existingProject = state.projects.find(item => item.id === project.id)
      if (existingProject === undefined) {
        state.projects.push(project)
      }
    },
    removeProject(state, project) {
      state.projects = state.projects.filter(item => item.id !== project.id)
    },
  },
  plugins: [createPersistedState({
    paths: ['profile', 'apiKey', 'softSubmit', 'overrideMode', 'userInfo', 'projects']
  })]
})