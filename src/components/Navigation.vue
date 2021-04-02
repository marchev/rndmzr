<template>
  <div class="nav">
    <nav class="navbar is-light has-shadow">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item">
              <img src="../assets/logo.png" style="max-height: 48px">
            </a>
            <h1 class="is-size-2 has-text-weight">rndmzr </h1>
            <b-tag type="is-danger" class="ml-3 mt-5">pre-beta</b-tag>
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
              <a class="navbar-item" @click="isDonateModalActive = true">
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
    <b-modal v-model="isDonateModalActive" :width="640" scroll="keep">
        <div class="card">
            <div class="card-content mx-5 my-5">
                <div class="content">
                    <div id="title" class="has-text-centered">
                        <p class="title is-3 mb-5 mt-3">Paysafe ❤️ SOS Children's Villages</p>
                    </div>
                    <div id="donation-message">
                      <p>
                        If this app made your life a bit easier, let's make make someone else's a bit brighter as well 😊
                      </p>
                      <p>
                        This extension is donationware - <b>all proceeds</b> received would be donated to <b><a href="https://sosbg.org/" target="_blank">SOS Children's Villages Bulgaria</a></b>.
                      </p>
                      <h4>How to donate?</h4>
                      <p>
                        Just send whatever amount you feel like donating to one of my digital wallets and I would make a bulk donation of all accumulated funds every week.
                        On this page you'd also be able to keep track on the amount we have donated so far 😊
                        <ul>
                          <li>Skrill: <span class="has-text-weight-bold">martin@marchev.org</span></li>
                          <li>Revolut: <a href="https://revolut.me/martinhs1" target="_blank" class="has-text-weight-bold">https://revolut.me/martinhs1</a> (Fallback! You should really consider using our own product though! 😅)</li>
                          <li>BTC: <span class="is-family-monospace has-text-weight-bold">1FW5AtNmatbpV4nU7xaNGSB96xySxmZFWE</span></li>
                          <li>ETH: <span class="is-family-monospace has-text-weight-bold">0x35B464157a0Cc00640B8e15d66393Bf157E6eaC7</span></li>
                          <li>
                            EOS: <span class="is-family-monospace has-text-weight-bold">coinbasebase</span> (Address)
                                 <span class="is-family-monospace has-text-weight-bold">3038522228</span> (EOS Memo)
                          </li>
                        </ul>
                        Please add note to the payment such as <span class="is-family-monospace has-text-weight-bold">rndmzr</span> or <span class="is-family-monospace has-text-weight-bold">SOS</span>
                      </p>
                      <h4>How much have we donated so far?</h4>
                      <h1 class="has-text-centered has-text-link">
                        BGN {{ donatedSoFar }}
                      </h1>
                      <p>
                        Thank you!
                      </p>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'Navigation',
  data() {
    return {
        isMobileMenuVisible: false,
        isDonateModalActive: false,
        donatedSoFar: undefined
    }
  },
  async created() {
    this.donatedSoFar = await this.fetchDonatedSoFar()
  },
  computed: {
    ...mapFields([
      'userInfo'
    ])
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    },
    async fetchDonatedSoFar() {
      const { data } = await this.$http.get('https://api.keyvalue.xyz/ed968af1/rndmzr-donations')
      return data 
    }
  }
}
</script>
