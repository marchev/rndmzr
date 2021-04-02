<template>
  <section>
    <h1 class="is-size-3 mt-4 mb-4">My projects</h1>
    <b-taglist>
      <b-tag v-for="project in projects"
          :key="project.id"
          type="is-info"
          size="is-medium"
          :closable="!project.unremovable"
          @close="removeProject(project)">{{ project.name }}</b-tag>
    </b-taglist>
    <b-field label="Search projects">
        <b-autocomplete
            :data="foundProjects"
            placeholder="Start typing project name here..."
            field="title"
            :loading="isFetching"
            @typing="fetchProject"
            @select="project => addProjectWithTasks(project)"
            :keep-first="true">

            <template slot-scope="props">
                <div class="media">
                    <div class="media-content">{{ props.option.name }}</div>
                </div>
            </template>
        </b-autocomplete>
    </b-field>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'MyProjects',
  data() {
    return {
        isFetching: false,
        foundProjects: []
    }
  },
  computed: {
    ...mapFields([
      'userInfo',
      'projects'
    ])
  },
  watch: {
    /* eslint-disable no-unused-vars */
    userInfo: async function (oldProjects, newProjects) {
      // As soon as userInfo is available, we add the default non-removable BAU project
      await this.addNonRemovableBAUProject()
    }
  },
  methods: {
    ...mapMutations([
      'addProject',
      'removeProject'
    ]),
    fetchProject: debounce(async function (name) {
        if (!name.length) {
            this.foundProjects = []
            return
        }
        
        try {
          this.isFetching = true
          this.foundProjects = []
          const projects = await this.findProjectsByName(name)
          projects.forEach(project => this.foundProjects.push(project))
        } catch (err) {
          this.foundProjects = []
          throw err
        } finally {
          this.isFetching = false
        }
    }, 500),
    async findProjectsByName(name) {
      let { data } = await this.$http.get(`/workspaces/${this.userInfo.activeWorkspace}/projects?name=${name}`)
      return data.map(project => ({ id: project.id, name: project.name }))
    },
    async addNonRemovableBAUProject() {
      const [ bauProject ] = await this.findProjectsByName("BAU Placeholder")
      bauProject.unremovable = true
      this.addProjectWithTasks(bauProject)
    },
    async addProjectWithTasks(project) {
      let { data } = await this.$http.get(`/workspaces/${this.userInfo.activeWorkspace}/projects/${project.id}/tasks?is-active=true&page-size=200`)
      const tasks = data.map(task => ({
        id: task.id,
        name: task.name,
        type: this.getTaskType(task.name)
      }))
      project.tasks = tasks
      this.addProject(project)
    },
    getTaskType(taskName) {
      return taskName.toLowerCase().includes('capex') ? 'capex' : 'opex'
    }
  }
}
</script>
