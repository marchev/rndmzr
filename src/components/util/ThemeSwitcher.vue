<template>
  <b-field v-if="visible">
      <b-switch
          class="theme-switcher"
          type="is-dark"
          passive-type="is-white"
          v-model="lightMode"
          @input="updateTheme()"> 
          <b-icon
              icon="sun"
              size="is-medium">
          </b-icon>
      </b-switch>
  </b-field>
</template>

<style lang="scss">
html {
  visibility: hidden;
}
</style>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ThemeSwitcher',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapFields([
      'darkMode'
    ]),
    lightMode: {
      get() {
        return !this.darkMode
      },
      set (value) {
        this.darkMode = !value
      }
    }
  },
  created() {
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelector('html').style.visibility = 'visible'
    })
    this.updateTheme()
  },
  methods: {
    updateTheme() {
      document.querySelector("#theme-dark").media = this.darkMode ? 'all' : 'not all'
    }
  }
}
</script>
