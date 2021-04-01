<template>
  <b-modal v-model="isConfigMissing" :width="480" :can-cancel="false" scroll="keep">
    <div class="card">
        <div class="card-content">
            <div class="content">
                <h3 class="has-text-centered">Missing configuration</h3>
                <p class="mt-5 mb-2">Please configure a <b>Profile</b> and <b>API Key</b> in the settings before using the extension.</p>
            </div>
        </div>
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
  }
}
</script>
