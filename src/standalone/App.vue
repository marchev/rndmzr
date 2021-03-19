<template>
  <div class="container">
    <h1 class="is-size-1 has-text-weight-bold">Rndmzr</h1>
    <h3 class="is-size-6 has-text-weight-light">Clockify timesheets randomizer</h3>
    <p>{{ userInfo.name }}</p>

    <section>
      <p class="content">
        <b>My projects:</b>
        <b-taglist>
          <b-tag v-for="project in selected" :key="project.id" type="is-info" size="is-medium" closable>{{ project.name }}</b-tag>
        </b-taglist>
      </p>
      <b-field label="Search projects">
          <b-autocomplete
              :data="data"
              placeholder="Start typing project name here..."
              field="title"
              :loading="isFetching"
              @typing="getAsyncData"
              @select="option => selected.push(option)"
              :keep-first="true">

              <template slot-scope="props">
                  <div class="media">
                      <div class="media-content">{{ props.option.name }}</div>
                  </div>
              </template>
          </b-autocomplete>
      </b-field>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import debounce from 'lodash/debounce'

const API_KEY = 'MmZhNDI0Y2UtZTBlZS00NzhmLThmNmEtZDU4NmE0ODc1OTA4'

export default {
  name: 'App',
  data() {
    return {
        data: [],
        selected: [],
        isFetching: false,
        userInfo: {}
    }
  },
  async mounted() {
    this.userInfo = await this.getUserInfo()
  },
  methods: {
    getAsyncData: debounce(function (name) {
        if (!name.length) {
            this.data = []
            return
        }
        
        this.isFetching = true
        axios.get(`https://api.clockify.me/api/v1/workspaces/${this.userInfo.activeWorkspace}/projects?name=${name}`, { headers: { 'X-Api-Key': API_KEY } })
            .then(({ data }) => {
                this.data = []
                data.forEach((item) => this.data.push(item))
            })
            .catch((error) => {
                this.data = []
                throw error
            })
            .finally(() => {
                this.isFetching = false
            })
    }, 500),
    async getUserInfo() {
      const response = await axios.get('https://api.clockify.me/api/v1/user', { headers: { 'X-Api-Key': API_KEY } })
      return response.data
    }
  }
}
</script>
