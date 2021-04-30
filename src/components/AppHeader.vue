<template>
  <div class="nav">
    <nav class="navbar has-shadow">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item">
              <img class="rndmzr-logo" />
            </a>
            <h1 class="is-size-2 has-text-weight-light">rndmzr</h1>
            <b-tag type="is-danger" class="beta-tag">beta</b-tag>
            <a class="navbar-burger mt-3 mr-3"
                @click="toggleMobileMenu"
                v-bind:class="{ 'is-active': isMobileMenuVisible }">
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>
          <div class="navbar-menu"
              v-bind:class="{ 'is-active': isMobileMenuVisible }"
              id="nav-links">
            <div class="navbar-end">
              <a class="navbar-item" @click="openDonationModal()">
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
              <div class="pt-4">
                <theme-switcher></theme-switcher>
              </div>
            </div>
          </div>
        </div>
    </nav>
    <donation-modal ref="donationModal"></donation-modal>
  </div>
</template>

<style lang="scss">
.beta-tag {
  margin-top: 1.25rem;
  margin-left: 1rem;
}

/** Light theme */
body[data-theme="light"] {
  nav.navbar {
    @extend .is-light !optional;
  }
}

/** Dark theme */
body[data-theme="dark"] {
  nav.navbar {
    @extend .is-dark !optional;
  }
}

/** Fix navbar rounded edges */
nav.navbar {
  border-radius: 0;
}
</style>

<script>
import { mapFields } from 'vuex-map-fields'
import DonationModal from './DonationModal.vue'
import ThemeSwitcher from './util/ThemeSwitcher.vue'

export default {
  name: 'Navigation',
  components: {
    DonationModal,
    ThemeSwitcher
  },
  data() {
    return {
        isMobileMenuVisible: false
    }
  },
  computed: {
    ...mapFields([
      'userInfo',
      'darkMode'
    ]),
    logoUrl: function () {
      return `/assets/logo-${this.darkMode ? 'white' : 'dark' }.png`
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    },
    openDonationModal() {
      this.$panelbear.track('donation_modal.open')
      this.$refs.donationModal.open()
    }
  }
}
</script>
