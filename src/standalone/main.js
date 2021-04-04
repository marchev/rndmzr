import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import store from '../store'
import httpClient from '../helpers/http-client'
import ClockifyService from '../services/clockify-service'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

// Enable Devtools
Vue.config.devtools = true

// Setup FontAwesome icons
library.add(fas)
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas",
  customIconPacks: {
    fas: {
      sizes: {
        default: "lg",
        "is-small": "1x",
        "is-medium": "2x",
        "is-large": "3x"
      },
      iconPrefix: ""
    }
  }
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