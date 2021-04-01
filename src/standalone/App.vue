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
    MissingConfig
    this.userInfo = await this.fetchUserInfo()
  },
  computed: {
    ...mapFields([
      'userInfo'
    ])
  },
  methods: {
    async fetchUserInfo() {
      const { data } = await this.$http.get('/user')
      return data
    }
  }
}
</script>
