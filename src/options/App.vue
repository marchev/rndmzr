<template>
  <div class="rndmzr-settings">
      <h3 class="is-size-2">Rndmzr Settings</h3>
      <label for="profile"> Profile </label>
      <select v-model="profile" id="profile" name="profile" autocomplete="profile">
        <option value="engineering-manager">Engineering Manager</option>
        <option value="agile-delivery-lead">Agile Delivery Lead</option>
        <option value="architect">Architect</option>
        <option value="product-owner">Product Owner</option>
      </select>
      <label for="apiKey"> API Key </label>
      <input v-model="apiKey" type="text" name="api_key" id="api_key" autocomplete="api_key">
      <div>
        <button @click="saveSettings" type="submit">
          Save
        </button>
      </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'App',
  computed: {
    ...mapFields([
      'profile',
      'apiKey',
    ])
  },
  async created () {
    await this.loadProfile()
    await this.loadApiKey()
  },
  methods: {
    ...mapActions(['loadProfile', 'updateProfile', 'loadApiKey', 'updateApiKey']),
    async saveSettings() {
      await this.updateProfile(this.profile)
      await this.updateApiKey(this.apiKey)
    }
  }
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
