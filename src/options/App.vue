<template>
  <div class="rndmzr-settings">

      <div class="container py-4 px-4">
        <h1 class="title">Settings</h1>
        <b-field label="Profile">
            <b-select placeholder="Select a profile" icon="users" expanded v-model="profile">
                <option v-for="option in profiles" :value="option.id" :key="option.id">
                    {{ option.label }}
                </option>
            </b-select>
        </b-field>
        <b-field label="API Key">
            <b-input style="font-familty:monospace !important" placeholder="Paste your API key here..." icon="key" v-model="apiKey">
            </b-input>
        </b-field>
        <div class="has-text-right">
          <b-button type="is-primary" class="my-2" @click="saveSettings">Save</b-button>
        </div>
      </div>
  </div>
</template>

<script>
import 'chrome-extension-async/chrome-extension-async'

export default {
  name: 'App',
  data () {
    return {
      'profile': '',
      'apiKey': '',
      'profiles': [
        { id: 'engineering-manager', label: 'Engineering Manager' },
        { id: 'agile-delivery-lead', label: 'Agile Delivery Lead' },
        { id: 'architect', label: 'Architect' },
        { id: 'product-owner', label: 'Product Owner' }
      ]
    }
  },
  async created () {
    const { profile, apiKey } = await chrome.storage.sync.get(['profile', 'apiKey'])
    this.profile = profile
    this.apiKey = apiKey
  },
  methods: {
    async saveSettings() {
      await chrome.storage.sync.set({
        profile: this.profile,
        apiKey: this.apiKey
      })
      this.$buefy.toast.open('Settings saved')
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
