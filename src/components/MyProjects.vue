<template>
  <section>
    <h1 class="is-size-3 mt-4 mb-4">My projects</h1>
    <b-taglist>
      <b-tag v-for="project in projects"
          :key="project.id"
          type="is-info"
          size="is-medium"
          :closable="!project.unremovable"
          @close="removeProjectFromMyProjects(project)">{{ project.name }}</b-tag>
    </b-taglist>
    <b-field label="Search projects">
        <b-autocomplete
            :data="foundProjects"
            placeholder="Start typing project name here..."
            field="title"
            :loading="isFetching"
            @typing="fetchProjects"
            @select="project => addProjectToMyProjects(project)"
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
  watch: {
    /* eslint-disable no-unused-vars */
    userInfo: async function (_, __) {
      // As soon as userInfo is available, we add the default BAU project if projects are empty
      if (!this.projects.length) {
        await this.addBAUProject()
      }
    }
  },
  computed: {
    ...mapFields([
      'userInfo',
      'projects'
    ]),
    workspace: function () {
      return this.userInfo.activeWorkspace
    }
  },
  methods: {
    ...mapMutations([
      'addProject',
      'removeProject'
    ]),
    fetchProjects: debounce(async function (name) {
        if (!name.length) {
            this.foundProjects = []
            return
        }
        
        try {
          this.isFetching = true
          this.foundProjects = []
          const projects = await this.$clockify.findProjectsByName(this.workspace, name)
          projects.forEach(project => this.foundProjects.push(project))
        } catch (err) {
          this.foundProjects = []
          this.$bugsnag.notify(err)
          console.error(err)
        } finally {
          this.isFetching = false
        }
    }, 500),
    async addBAUProject() {
      const [ bauProject ] = await this.$clockify.findProjectsByName(this.workspace, "BAU Placeholder")
      bauProject.unremovable = true
      this.addProjectToMyProjects(bauProject)
    },
    async addProjectToMyProjects(project) {
      const tasks = (await this.$clockify.getProjectTasks(this.workspace, project.id)).map(task => ({
        id: task.id,
        name: task.name,
        type: this.$clockify.getTaskType(task.name)
      }))
      project.tasks = tasks
      this.addProject(project)
      this.$bugsnag.leaveBreadcrumb('Project added', { project })
    },
    async removeProjectFromMyProjects(project) {
      this.$bugsnag.leaveBreadcrumb('Project removed', { project })
      this.removeProject(project)
    }
  }
}
</script>
