import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import store from '../store'
import axios from 'axios'

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Setup FontAwesome icons
library.add(fas)
Vue.component('vue-fontawesome', FontAwesomeIcon)

// Replace $http with 
axios.defaults.baseURL = 'https://api.clockify.me/api/v1'
Vue.prototype.$http = axios

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

/* eslint-disable no-unused-vars */
store.dispatch('loadApiKey')
  .then(apiKeyLoaded => {
    Vue.prototype.$http.defaults.headers.common['X-Api-Key'] = store.state.apiKey
    
    /* eslint-disable no-new */
    new Vue({
      store,
      el: '#app',
      render: h => h(App)
    })
  })
