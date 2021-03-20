<template>
  <div>
    <nav class="navbar is-light has-shadow">
      <!-- Logo / Brand -->
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
            <a class="navbar-item">Donate</a>
            <a class="navbar-item mr-5">
              {{ userInfo.email }}
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
    </div>
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
        userInfo: {},
        isMobileMenuVisible: false
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
    },
    toggleMobileMenu() {
      this.isMobileMenuVisible = !this.isMobileMenuVisible
    }
  }
}
</script>
