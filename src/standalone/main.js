import Vue from 'vue'
import { version } from '../../package.json'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
// Configure Bugsnag
Bugsnag.start({
  appVersion: version,
  apiKey: 'aa69e867b15752ede4c55948a83f144e',
  plugins: [new BugsnagPluginVue()],
  onError: event => {
    event.errors[0].stacktrace = event.errors[0].stacktrace.map(frame => {
      frame.file = frame.file.replace(/chrome-extension:/g, 'chrome_extension:')
      return frame
    })
  }
})

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import App from './App.vue'
import store from '../store'
import httpClient from '../helpers/http-client'
import ClockifyService from '../services/clockify-service'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import * as Panelbear from "@panelbear/panelbear-js"

// Setup Panelbear
Panelbear.load('3nnrFy5shOb')
Panelbear.trackPageview()

// Setup Bugsnag
const bugsnagVue = Bugsnag.getPlugin('vue')
bugsnagVue.installVueErrorHandler(Vue)

// Enable Devtools
Vue.config.devtools = true

// Setup FontAwesome icons
library.add(fas)
library.add(fab)
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.use(Buefy, {
  defaultIconComponent: FontAwesomeIcon,
  defaultIconPack: 'fas'
})

// Init Clockify service
const clockify = new ClockifyService(httpClient)

// Inject 
Vue.prototype.$http = httpClient
Vue.prototype.$clockify = clockify
Vue.prototype.$panelbear = Panelbear
Vue.prototype.$bugsnag = Bugsnag

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  render: h => h(App)
})