import { mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import { isProfileTask, findDayOffTask, getAllTimesheetTaskIds } from '@/helpers/timesheet-helpers'

export default {
    computed: {
        ...mapFields([
            'projects',
            'userInfo',
            'profile',
            'timeEntries'
        ]),
        workspace: function () {
            return this.userInfo.activeWorkspace
        },
        projectsCount: function () {
            return this.projects.length
        },
        profileProjects: function () {
            return this.projects.map(project => ({
                ...project,
                tasks: project.tasks.filter(task => isProfileTask(task, this.distributionProfile))
            }))
        },
        profileProjectsPlusTimeOff: function () { // TODO: Come up with a better approach
            const dayOffTask = findDayOffTask(this.projects)
            return this.projects.map(project => ({
                ...project,
                tasks: project.tasks.filter(task => isProfileTask(task, this.distributionProfile) ||
                                                    task.id === dayOffTask.id)
            }))
        },
        projectIds: function () {
            return this.projects.map(project => project.id)
        },
        allTasks: function () {
            return this.projects.flatMap(project => project.tasks)
        },
        allTaskIds: function () {
            return this.projects.flatMap(project => project.tasks).map(task => task.id)
        }
    },
    methods: {
        ...mapMutations([
            'addProject',
            'removeProject'
        ]),
        getTaskProjectId(taskId) {
            const [ projectId ] = this.projects
                .filter(project => project.tasks.filter(task => task.id === taskId).length)
                .map(project => project.id)
            return projectId
        },
        async addBAUProject() {
          const [ bauProject ] = await this.$clockify.findProjectsByName(this.workspace, "BAU Placeholder")
          bauProject.unremovable = true
          bauProject.name = "BAU Placeholder"
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
            if (this.hasProjectAnyTimeEntries(project)) {
                this.openSnackbar(`Project cannot be removed as time entries have been reported for it`, 'is-danger')
                return
            }
            this.$bugsnag.leaveBreadcrumb('Project removed', { project })
            this.removeProject(project)
        },
        hasProjectAnyTimeEntries(project) {
            const projectTaskIds = project.tasks.map(task => task.id)
            const timesheetTaskIds = getAllTimesheetTaskIds(this.timeEntries)
            return projectTaskIds.filter(x => timesheetTaskIds.includes(x)).length > 0
        }
    }
}