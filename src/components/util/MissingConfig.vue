<template>
  <b-modal v-model="isConfigMissing" :width="480" :can-cancel="false" scroll="keep">
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Missing configuration</p>
        </header>
        <section class="modal-card-body">
            Please configure a <span class="semi-bold">Profile</span> and <span class="semi-bold">API Key</span> in
            the <span class="semi-bold"><a @click="openSettings()">Settings</a></span> page in order to use the extension.
        </section>
        <footer class="modal-card-foot">
        </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'MissingConfig',
  computed: {
    ...mapFields([
      'profile',
      'apiKey'
    ]),
    isConfigMissing: function() {
      return !this.profile || !this.apiKey
    }
  },
  methods: {
    openSettings() {
      chrome.runtime.openOptionsPage()
    }
  }
}
</script>
