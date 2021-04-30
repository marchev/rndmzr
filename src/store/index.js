import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getField, updateField } from 'vuex-map-fields';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    darkMode: false,
    profile: '',
    apiKey: '',
    softSubmit: false,
    overrideMode: false,
    capexOpexViolationMode: false,
    capexOpexViolationThreshold: 5,
    reminder: false,
    reminderDays: [],
    reminderTime: '1970-01-01T07:00:00Z',
    timeEntries: [],
    projects: [],
    userInfo: {},
    capexOpexRatioViolations: [],
    status: 'UNSUBMITTED'
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
    paths: [
      'darkMode',
      'profile',
      'apiKey',
      'softSubmit',
      'overrideMode',
      'capexOpexViolationMode',
      'capexOpexViolationThreshold',
      'reminder',
      'reminderDays',
      'reminderTime',
      'userInfo',
      'projects'
    ]
  })]
})