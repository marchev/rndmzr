<template>
  <div>
    <app-header></app-header>
    <div class="container">
      <my-projects></my-projects>
      <timesheet-table></timesheet-table>
    </div>
    <missing-config></missing-config>
    <app-footer></app-footer>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import AppHeader from '../components/AppHeader.vue'
import MyProjects from '../components/MyProjects.vue'
import TimesheetTable from '../components/TimesheetTable.vue'
import MissingConfig from '../components/util/MissingConfig.vue'
import AppFooter from '../components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
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
