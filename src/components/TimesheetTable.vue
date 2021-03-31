<template>
  <section>
        <div id="generator" class="generator mt-4 columns">
            <div class="column">
            <b-button @click="randomize()" type="is-dark" class="mr-2">Randomize!</b-button>
            <b-button @click="reset()" type="is-light">Reset</b-button>
            </div>
            <div class="column has-text-right">
            <b-button :disabled="isTimesheetEmpty" @click="submit()" type="is-danger">Submit</b-button>
            </div>
        </div>
        <b-table class="mb-6" pagination-position="top" paginated pagination-simple backend-pagination :per-page="numOfProjects" :total="totalPaginationData" :current-page="currentPage" @page-change="pageNum => onPageChange(pageNum)" :data="showProfileTasksOnly ? timesheetProjects : projects" :default-sort="['name', 'asc']" ref="table" detailed hoverable custom-detail-row detail-key="id" :opened-detailed="projectIds" :show-detail-icon="true">

            <b-table-column field="project" label="Project" width="300" v-slot="props">
                <span class="has-text-weight-bold">
                    {{ props.row.name }}
                </span>
            </b-table-column>

            <b-table-column v-for="(weekDate, index) in weekDates" :key="weekDate.format('dddd')" :label="weekDate.format('ddd, MMM D')" centered v-slot="props">
                <b-tag type="is-light has-text-weight-semibold">{{ dayTotalsPerProject[index+1][props.row.id].format('H:mm') }}</b-tag>
            </b-table-column>

            <template slot="detail" slot-scope="props">
                <tr v-for="task in props.row.tasks" :key="task.id">
                    <td></td>
                    <td>{{ task.name }}</td>
                    <td v-for="index in 7" :key="index" class="has-text-centered">
                        <div class="duration-picker mx-3 px-1">
                            <duration-picker v-model="timeEntries[index][task.id]">
                            </duration-picker>
                        </div>
                    </td>
                </tr>
            </template>

            <template #footer>
                <th class="is-hidden-mobile">
                    <div class="th-wrap is-numeric">&nbsp;</div>
                </th>
                <th class="is-hidden-mobile">
                    <div class="th-wrap">Total:</div>
                </th>
                <th v-for="index in 7" :key="index" class="is-hidden-mobile">
                    <div class="th-wrap is-centered">
                        <span :class="
                                [
                                    'tag',
                                    {'is-danger': index <= 5 && dayTotals[index].asHours() < 8 },
                                    {'is-success': index <= 5 && dayTotals[index].asHours() >= 8 },
                                    {'is-light': index > 5 && dayTotals[index].asMinutes() === 0 },
                                    {'is-warning': index > 5 && dayTotals[index].asMinutes() > 0 }
                                ]">
                            {{ dayTotals[index].format('H:mm') }}
                        </span>
                    </div>
                </th>
            </template>
            <template #top-left>
                <div id="profile-tasks-switch" class="has-text-weight-semibold">
                    <b-switch v-model="showProfileTasksOnly" type="is-success">Show profile tasks only</b-switch>
                </div>
            </template>
        </b-table>
        <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false">
            <b-icon
                pack="fas"
                icon="sync-alt"
                size="is-large"
                custom-class="fa-spin">
            </b-icon>
        </b-loading>
  </section>
</template>

<style>
nav.pagination small {
    display:none;
}
</style>

<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { mapFields } from 'vuex-map-fields'
import ProfileService from '../services/profile-service'
import TimesheetGeneratorService from '../services/timesheet-generator-service'
import DurationPicker from './util/DurationPicker.vue'

dayjs.extend(duration)

const profileService = new ProfileService()
const timesheetGeneratorService = new TimesheetGeneratorService()

const WEEKS_SUPPORTED = 52

export default {
    name: 'TimesheetTable',
    components: { DurationPicker },
    data () {
        return {
            weekDates: [],
            timeEntries: {},
            distributionProfile: {},
            showProfileTasksOnly: true,
            previousPage: WEEKS_SUPPORTED,
            isLoading: false,
        }
    },
    computed: {
        ...mapFields([
            'userInfo',
            'projects',
            'profile'
        ]),
        numOfProjects: function () {
            return this.projects.length
        },
        totalPaginationData: function () {
            return this.numOfProjects * WEEKS_SUPPORTED * 2 // 1 year back - 1 year ahead
        },
        currentPage: function () {
            return WEEKS_SUPPORTED
        },
        timesheetProjects: function () {
            return this.projects.map(project => ({
                ...project,
                tasks: project.tasks.filter(task => this.isProfileTask(task))
            }))
        },
        projectIds: function () {
            return this.projects.map(project => project.id)
        },
        dayTotals: function () {
            const totals = []

            for (let i = 1; i <= 7; i++) {
                const dayTaskEntries = this.timeEntries[i]
                const total = Object.values(dayTaskEntries).reduce((prev, current) => prev.add(current), dayjs.duration(0))
                totals[i] = total
            }

            return totals
        },
        dayTotalsPerProject: function () {
            const totalsPerProject = []

            for (let i = 1; i <= 7; i++) {
                const dayTotalsPerProject = this.projects.map(project => ({
                    [project.id]: project.tasks
                                    .filter(task => !!this.timeEntries[i][task.id])
                                    .map(task => this.timeEntries[i][task.id])
                                    .reduce((accumulator, value) => accumulator.add(value), dayjs.duration(0))
                }))
                .reduce((accumulator, value) => {
                    Object.entries(value).forEach(([key, value]) => {
                        accumulator[key] = value
                    })
                    return accumulator
                }, {})

                totalsPerProject[i] = dayTotalsPerProject
            }

            return totalsPerProject
        },
        isTimesheetEmpty: function () {
            return this.dayTotals.reduce((a, b) => a.add(b), dayjs.duration(0)).asMinutes() == 0
        }
    },
    created() {
        this.initWeekDates()
        this.distributionProfile = profileService.getDistributionProfile(this.profile)
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
        initWeekDates() {
            const wd = this.getWeekDates()
            for (let i = 0; i < wd.length; i++) {
                this.$set(this.weekDates, i, wd[i])
            }
        },
        getWeekDates() {
            return Array.from({length: 7}, (_, i) => i + 1)
                .map(i => dayjs().startOf('week').day(i))
        },
        isProfileTask(task) {
            for (const distProfileTask of this.distributionProfile.tasks) {
                if (task.name.includes(distProfileTask)) {
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
                        this.$set(this.timeEntries[i], taskId, dayjs.duration(0))
                    }
                })

                // Remove dangling tasks
                for (const [key] of Object.entries(this.timeEntries[i])) {
                    if (!allProjectsTasks.includes(key)) {
                        this.$delete(this.timeEntries[i], key)
                    }
                }
            }
        },
        populateTimeEntries(weekTimesheet) {
            Object.entries(weekTimesheet).forEach(([day, tasks]) => {
                Object.entries(tasks).forEach(([taskId, duration]) => {
                    if (!this.timeEntries[day][taskId]) {
                        console.error(`Cannot find task ${taskId} for day ${day}`)
                    }
                    else {
                        this.timeEntries[day][taskId] = duration
                    }
                })
            })
        },
        getTaskProjectId(taskId) {
            const [ projectId ] = this.projects
                .filter(project => project.tasks.filter(task => task.id === taskId).length)
                .map(project => project.id)
            return projectId
        },
        randomize() {
            this.isLoading = true
            this.reset()
            const weekTimesheet = timesheetGeneratorService.generateTimesheet(this.distributionProfile, this.timesheetProjects)
            console.log(JSON.stringify(weekTimesheet))
            this.populateTimeEntries(weekTimesheet)
            this.$buefy.toast.open('Successfully randomized that sh*t 🧐')
            this.isLoading = false
        },
        reset() {
            Object.entries(this.timeEntries).forEach(([day, tasks]) => {
                Object.entries(tasks).forEach(([taskId]) => {
                    this.timeEntries[day][taskId] = dayjs.duration(0, 'minutes')
                })
            })
        },
        async submit() {
            this.isLoading = true
            const clockifyEntries = []
            
            this.weekDates.forEach(day => {
                const dayEntries = this.createClockifyTimeEntries(day)
                clockifyEntries.push(...dayEntries)
            })

            await this.submitClockifyEntries(clockifyEntries)
            this.isLoading = false

            this.$buefy.snackbar.open({
                    message: 'Your timesheet has been submitted successfully',
                    type: 'is-success',
                    position: 'is-top',
                    actionText: 'OK',
                    duration: 5000
                })
        },
        createClockifyTimeEntries(day) {
            const clockifyDayEntries = []
            const dayIndex = day.get('day') != 0 ? day.get('day') : 7 // Hack around the fact that dayjs considers Sunday to be the 0th week day
            const dayEntries = Object.entries(this.timeEntries[dayIndex]) // We get all non-zero time entries for the day
                                    // eslint-disable-next-line no-unused-vars
                                    .filter(([_, duration]) => duration.asMinutes() > 0)
                                    .reduce((obj, [taskId, duration]) => {
                                        obj[taskId] = duration
                                        return obj
                                    }, {})

            const workDayStart = 10
            let timeToStartNextEntry = this.weekDates[0].startOf('week').day(dayIndex).hour(workDayStart)
            // NASTY HACK ALERT!!1 ☝️

            Object.entries(dayEntries).forEach(([taskId, duration]) => {
                const start = timeToStartNextEntry
                const end = start.add(duration.asMinutes(), 'minute')
                const projectId = this.getTaskProjectId(taskId)
                const clockifyEntry = {
                    'start': start.toISOString(),
                    'end': end.toISOString(),
                    'projectId': projectId,
                    'taskId': taskId
                }
                clockifyDayEntries.push(clockifyEntry)
                timeToStartNextEntry = end
            })

            return clockifyDayEntries
        },
        async submitClockifyEntries(clockifyEntries) {
            for (const clockifyEntry of clockifyEntries) {
                const response = await this.$http.post(`/workspaces/${this.userInfo.activeWorkspace}/time-entries`, clockifyEntry)
                console.log(`${response.status} for ${JSON.stringify(clockifyEntry)}`)
            }
            // Actual submit
            // const beginningOfWeek = this.weekDates[0].toISOString()
            // const approvalRequest = {
            //     weekTime: beginningOfWeek
            // }
            // try {
            //     const approvalRequestResp = await this.$http.post(`https://global.api.clockify.me/workspaces/${this.userInfo.activeWorkspace}/users/${this.userInfo.id}/approval-requests/`, approvalRequest)
            //     console.log(`Approval request status code: ${approvalRequestResp.status}`)
            // } catch (err) {
            //     if (err.response) {
            //         console.log(err.response.data);
            //         console.log(err.response.status);
            //         console.log(err.response.headers);
            //     }
            // } finally {
            //     this.isLoading = false
            // }
        },
        onPageChange(currentPage) {
            this.reset()
            const weekAheadOrBehind = currentPage - this.previousPage
            for (let i = 0; i < 7; i++) {
                this.$set(this.weekDates, i, this.weekDates[i].add(weekAheadOrBehind, 'week'))
            }
            this.previousPage = currentPage
        }
    }
}
</script>
