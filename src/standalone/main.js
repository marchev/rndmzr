import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
