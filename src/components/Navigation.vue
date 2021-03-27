<template>
  <nav class="navbar is-light has-shadow">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item">
            <img src="../assets/logo.png" style="max-height: 48px">
          </a>
          <h1 class="is-size-2 has-text-weight">rndmzr </h1>
          <b-tag type="is-danger" class="ml-3 mt-5">beta</b-tag>
          <a class="navbar-burger mt-3 mr-3" @click="toggleMobileMenu" v-bind:class="{ 'is-active': isMobileMenuVisible }">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div class="navbar-menu" v-bind:class="{ 'is-active': isMobileMenuVisible }" id="nav-links">
          <div class="navbar-end">
            <a class="navbar-item">
              <b-icon
                  pack="fas"
                  icon="donate"
                  size="is-small">
              </b-icon>
              <span class="ml-2">Donate</span>
            </a>
            <a class="navbar-item mr-5" v-if="userInfo.name">
              <b-icon
                  pack="fas"
                  icon="user"
                  size="is-small">
              </b-icon>
              <span class="ml-2">{{ userInfo.name }}</span>
            </a>
            <a class="content navbar-item mr-5" v-if="!userInfo.name">
              <b-icon
                  pack="fas"
                  icon="user"
                  size="is-small"
                  class="mr-2">
              </b-icon>
              <b-skeleton width="130px" :animated="true"></b-skeleton>
            </a>
          </div>
        </div>
      </div>
  </nav>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'Navigation',
  data() {
    return {
        isMobileMenuVisible: false
    }
  },
  computed: {
    ...mapFields([
      'userInfo'
    ])
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    }
  }
}
</script>
