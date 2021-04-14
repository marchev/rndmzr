import Vue from 'vue'
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

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  render: h => h(App)
})