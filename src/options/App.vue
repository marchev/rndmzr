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
import 'chrome-extension-async/chrome-extension-async'

export default {
  name: 'App',
  data () {
    return {
      profile: '',
      apiKey: ''
    }
  },
  async created () {
    const settings = await chrome.storage.sync.get(['profile', 'apiKey'])
    this.profile = settings.profile
    this.apiKey = settings.apiKey
  },
  methods: {
    async saveSettings() {
      await chrome.storage.sync.set({
        profile: this.profile,
        apiKey: this.apiKey
      })
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
