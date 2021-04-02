<template>
  <div>
    <navigation></navigation>
    <div class="container">
      <my-projects></my-projects>
      <timesheet-table></timesheet-table>
    </div>
    <missing-config></missing-config>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import Navigation from '../components/Navigation.vue'
import MyProjects from '../components/MyProjects.vue'
import TimesheetTable from '../components/TimesheetTable.vue'
import MissingConfig from '../components/util/MissingConfig.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    MyProjects,
    TimesheetTable,
    MissingConfig
  },
  async created() {
    this.userInfo = await this.$clockify.getUserInfo()
  },
  computed: {
    ...mapFields([
      'userInfo'
    ])
  }
}
</script>
