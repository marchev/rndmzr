import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import App from './App.vue'
import store from '../store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Setup FontAwesome icons
library.add(fas)
library.add(fab)
Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.use(Buefy, {
  defaultIconComponent: FontAwesomeIcon,
  defaultIconPack: 'fas'
})

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  render: h => h(App)
})
