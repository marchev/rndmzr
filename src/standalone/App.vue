<template>
  <div>
    <nav class="navbar is-light has-shadow">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item">
            <img src="../assets/logo.png" style="max-height: 48px">
          </a>
          <h1 class="is-size-2 has-text-weight">rndmzr</h1>
          <a class="navbar-burger mt-3 mr-3" @click="toggleMobileMenu" v-bind:class="{ 'is-active': isMobileMenuVisible }">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div class="navbar-menu" v-bind:class="{ 'is-active': isMobileMenuVisible }" id="nav-links">
          <div class="navbar-end">
            <a class="navbar-item">
              <b-icon
                  pack="fas"
                  icon="donate"
                  size="is-small">
              </b-icon>
              <span class="ml-2">Donate</span>
            </a>
            <a class="navbar-item mr-5" v-if="userInfo.name">
              <b-icon
                  pack="fas"
                  icon="user"
                  size="is-small">
              </b-icon>
              <span class="ml-2">{{ userInfo.name }}</span>
            </a>
            <a class="content navbar-item mr-5" v-if="!userInfo.name">
              <b-icon
                  pack="fas"
                  icon="user"
                  size="is-small"
                  class="mr-2">
              </b-icon>
              <b-skeleton width="130px" :animated="true"></b-skeleton>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <div class="container">
      <section>
          <h1 class="is-size-3 mt-4 mb-4">My projects</h1>
          <b-taglist>
            <b-tag v-for="project in selected" :key="project.id" type="is-info" size="is-medium" closable>{{ project.name }}</b-tag>
          </b-taglist>
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
      <br/>
      <timesheet-table></timesheet-table>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import TimesheetTable from '../components/TimesheetTable.vue'

export default {
  name: 'App',
  components: { TimesheetTable },
  async created () {
    this.userInfo = await this.getUserInfo()
    await this.loadProfile()
  },
  data() {
    return {
        data: [],
        selected: [],
        isFetching: false,
        userInfo: {},
        isMobileMenuVisible: false
    }
  },
  computed: {
    ...mapFields([
      'profile'
    ])
  },
  methods: {
    ...mapActions([
      'loadProfile'
    ]),
    getAsyncData: debounce(function (name) {
        if (!name.length) {
            this.data = []
            return
        }
        
        this.isFetching = true
        this.$http.get(`/workspaces/${this.userInfo.activeWorkspace}/projects?name=${name}`)
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
      const response = await this.$http.get('/user')
      return response.data
    },
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    }
  }
}
</script>
