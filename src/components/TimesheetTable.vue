<template>
  <section>
        <b-table class="mt-5" :data="showProfileTasksOnly ? profileProjects : projects" :default-sort="['name', 'asc']" ref="table" detailed hoverable custom-detail-row detail-key="id" :opened-detailed="projectIds" :show-detail-icon="true">

            <b-table-column field="project" label="Project" width="300" v-slot="props">
                <span class="has-text-weight-bold">
                    {{ props.row.name }}
                </span>
            </b-table-column>

            <b-table-column v-for="weekDate in weekDates" :key="weekDate.format('dddd')" :label="weekDate.format('ddd, MMM D')" centered v-slot="props">
                <span style="display:none">{{ props.row.name }}</span>
                &nbsp;
            </b-table-column>

            <b-table-column label="Total" centered v-slot="props">
                <span style="display:none">{{ props.row.name }}</span>

                <!--
                <span :class="
                        [
                            'tag',
                            {'is-danger': false },
                            {'is-success': true }
                        ]">
                    8:00
                </span>
                -->
            </b-table-column>

            <template slot="detail" slot-scope="props">
                <tr v-for="task in props.row.tasks" :key="task.id">
                    <td></td>
                    <td>{{ task.name }}</td>
                    <td v-for="index in 7" :key="index" class="has-text-centered">
                        <div class="duration-picker mx-4">
                            <duration-picker v-model="timeEntries[index][task.id]">
                            </duration-picker>
                        </div>
                    </td>
                    <td class="has-text-centered">
                        <span :class="
                                [
                                    'tag',
                                    {'is-danger': false },
                                    {'is-success': true }
                                ]">
                            8:00
                        </span>
                    </td>
                </tr>
            </template>
        </b-table>
        <div id="profile-tasks-switch" class="mt-5">
            <b-switch v-model="showProfileTasksOnly" type="is-success">Show profile tasks only</b-switch>
        </div>
        <pre>
            {{ timeEntries }}
        </pre>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { mapFields } from 'vuex-map-fields'
import ProfileService from '../services/profile-service'

import DurationPicker from './util/DurationPicker.vue'

dayjs.extend(duration)
const profileService = new ProfileService()

export default {
    name: 'TimesheetTable',
    components: {
        DurationPicker
    },
    computed: {
        ...mapFields([
            'projects',
            'profile'
        ]),
        profileProjects: function () {
            return this.projects.map(project => ({
                ...project,
                tasks: project.tasks.filter(task => this.isProfileTask(task))
            }))
        },
        projectIds: function () {
            return this.projects.map(project => project.id)
        }
    },
    data () {
        return {
            timeEntries: {},
            capexOpexDistribution: {},
            showProfileTasksOnly: true
        }
    },
    created() {
        this.weekDates = this.getWeekDates()
        this.capexOpexDistribution = profileService.getCapexOpexDistribution(this.profile)
        this.initTimeEntries(this.projects)
    },
    watch: {
        projects: function (projects) {
            this.initTimeEntries(projects)
        }
    },
    methods: {
        toggle(row) {
            this.$refs.table.toggleDetails(row)
        },
        getWeekDates() {
            return Array.from({length: 7}, (_, i) => i + 1)
                .map(i => dayjs().startOf('week').day(i))
        },
        isProfileTask(task) {
            for (let i = 0; i < this.capexOpexDistribution.tasks.length; i++) {
                if (task.name.includes(this.capexOpexDistribution.tasks[i].name)) {
                    return true
                }
            }
            return false
        },
        initTimeEntries(projects) {
            const allProjectsTasks = []
            projects.forEach(project => {
                project.tasks.forEach(task => allProjectsTasks.push(task.id))
            })

            for (let i = 1; i <= 7; i++) {
                if (!this.timeEntries[i]) {
                    this.$set(this.timeEntries, i, {})
                }

                // Add new tasks
                allProjectsTasks.forEach(taskId => {
                    if (!this.timeEntries[i][taskId]) {
                        this.$set(this.timeEntries[i], taskId, dayjs.duration())
                    }
                })

                // Remove dangling tasks
                for (const [key] of Object.entries(this.timeEntries[i])) {
                    if (!allProjectsTasks.includes(key)) {
                        this.$delete(this.timeEntries[i], key)
                    }
                }
            }
        }
    }
}
</script>
