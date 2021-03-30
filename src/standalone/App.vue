<template>
  <div>
    <navigation></navigation>
    <div class="container">
      <my-projects></my-projects>
      <timesheet-table></timesheet-table>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import Navigation from '../components/Navigation.vue'
import MyProjects from '../components/MyProjects.vue'
import TimesheetTable from '../components/TimesheetTable.vue'

export default {
  name: 'App',
  components: {
    Navigation,
    MyProjects,
    TimesheetTable
  },
  async created() {
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
