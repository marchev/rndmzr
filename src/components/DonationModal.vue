<template>
    <b-modal v-model="showModal" :width="640" scroll="keep">
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
                        This app is donationware - <b>all proceeds</b> received would be donated to <b><a href="https://sosbg.org/" target="_blank">SOS Children's Villages Bulgaria</a></b>.
                      </p>
                      <h4>How to donate?</h4>
                      <p>
                        Whatever you donate to one of my digital wallets below would be bulk donnated on a weekly basis.
                        <ul>
                          <li>Skrill: <span class="has-text-weight-bold">martin@marchev.org</span></li>
                          <li>Revolut: <a href="https://revolut.me/martinhs1" target="_blank" class="has-text-weight-bold">https://revolut.me/martinhs1</a></li>
                        </ul>
                        Please add note to the payment such as <span class="is-family-monospace has-text-weight-bold">rndmzr</span> or <span class="is-family-monospace has-text-weight-bold">SOS</span>
                      </p>
                      <h4>How much have we donated so far?</h4>
                      <h1 class="has-text-centered has-text-link">
                        BGN {{ donatedSoFar }}
                      </h1>
                      <h4>Thank you!</h4>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
export default {
  name: 'DonationModal',
  data () {
    return {
      showModal: false,
      donatedSoFar: undefined
    }
  },
  async created() {
    this.donatedSoFar = await this.fetchDonatedSoFar()
  },
  methods: {
    open() {
      this.showModal = true
    },
    async fetchDonatedSoFar() {
      const { data } = await this.$http.get('https://gitcdn.link/repo/marchev/rndmzr-stats/main/donations')
      return data 
    }
  }
}
</script>
