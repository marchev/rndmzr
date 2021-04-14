import { mapFields } from 'vuex-map-fields'

import { isProfileTask } from '@/helpers/timesheet-helpers'

export default {
    computed: {
        ...mapFields([
            'projects',
            'profile'
        ]),
        projectsCount: function () {
            return this.projects.length
        },
        profileProjects: function () {
            return this.projects.map(project => ({
                ...project,
                tasks: project.tasks.filter(task => isProfileTask(task, this.distributionProfile))
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
        getTaskProjectId(taskId) {
            const [ projectId ] = this.projects
                .filter(project => project.tasks.filter(task => task.id === taskId).length)
                .map(project => project.id)
            return projectId
        }
    }
}