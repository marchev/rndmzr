<template>
  <div class="rndmzr-settings">

      <div class="container py-4 px-4">
        <h1 class="title">Settings</h1>
        <b-field label="Profile">
            <b-select placeholder="Select a profile" icon="users" expanded v-model="profileFieldValue">
                <option v-for="option in profiles" :value="option.id" :key="option.id">
                    {{ option.label }}
                </option>
            </b-select>
        </b-field>
        <b-field label="API Key">
            <b-input style="font-familty:monospace !important" placeholder="Paste your API key here..." icon="key" v-model="apiKeyValue">
            </b-input>
        </b-field>
        <b-field label="Soft Submit">
          <b-tooltip multilined label="Only creates time entries without submitting them for approval"
            position="is-right">
            <b-switch v-model="softSubmit" type="is-default">
            </b-switch>
          </b-tooltip>
        </b-field>
        <div class="has-text-right">
          <b-button type="is-primary" class="my-2" @click="saveSettings">Save</b-button>
        </div>
      </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'App',
  computed: {
    ...mapFields([
      'profile',
      'apiKey',
      'softSubmit'
    ])
  },
  data () {
    return {
      profileFieldValue: '',
      apiKeyValue: '',
      'profiles': [
        { id: 'engineering-manager', label: 'Engineering Manager' },
        { id: 'agile-delivery-lead', label: 'Agile Delivery Lead' },
        { id: 'architect', label: 'Architect' },
        { id: 'product-owner', label: 'Product Owner' }
      ]
    }
  },
  async created () {
    this.profileFieldValue = this.profile
    this.apiKeyValue = this.apiKey
  },
  methods: {
    async saveSettings() {
      this.profile = this.profileFieldValue
      this.apiKey = this.apiKeyValue
      this.$buefy.toast.open('Settings saved')
    }
  }
}
</script>

<style>
html {
  width: 400px;
  height: 310px;
}
</style>
