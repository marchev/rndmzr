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
        <b-table class="mb-6"
            :data="showProfileTasksOnly ? profileProjects : projects"
            :default-sort="['name', 'asc']"
            ref="table"
            detailed
            hoverable
            custom-detail-row
            detail-key="id"
            :opened-detailed="projectIds"
            :show-detail-icon="true"
            paginated
            pagination-position="top"
            pagination-simple
            backend-pagination
            :per-page="projectsCount"
            :total="totalPages"
            :current-page="currentPage"
            @page-change="newPage => onPageChange(newPage)">

            <b-table-column field="project" label="Project" width="300" v-slot="project">
                <span class="has-text-weight-bold">
                    {{ project.row.name }}
                </span>
            </b-table-column>

            <b-table-column v-for="(weekDate, index) in weekDates"
                :key="weekDate | weekday"
                :label="weekDate | fulldate"
                centered
                v-slot="project">
                <b-tag type="is-light has-text-weight-semibold">
                    {{ dayTotalsPerProject[index][project.row.id] | hoursCount }}
                </b-tag>
            </b-table-column>

            <template slot="detail" slot-scope="props">
                <tr v-for="task in props.row.tasks" :key="task.id">
                    <td></td>
                    <td>{{ task.name }}</td>
                    <td v-for="(_, index) in weekDates" :key="index" class="has-text-centered">
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
                <th v-for="(_, index) in weekDates" :key="index" class="is-hidden-mobile">
                    <div class="th-wrap is-centered">
                        <span :class="
                                [
                                    'tag',
                                    {'is-danger': index <= 4 && dayTotals[index].asHours() < 8 },
                                    {'is-success': index <= 4 && dayTotals[index].asHours() >= 8 },
                                    {'is-light': index > 4 && dayTotals[index].asMinutes() === 0 },
                                    {'is-warning': index > 4 && dayTotals[index].asMinutes() > 0 }
                                ]">
                            {{ dayTotals[index] | hoursCount }}
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
import { mapFields } from 'vuex-map-fields'
import ProfileService from '../services/profile-service'
import TimesheetGeneratorService from '../services/timesheet-generator-service'
import DurationPicker from './util/DurationPicker.vue'
import { currentWeekStart, weeksInYear, daysInWeek, zeroDuration } from '@/helpers/time-helpers'
import { getAllProjectsTasks, isProfileTask, getDayEntries, timeToStartEntries } from '@/helpers/timesheet-helpers'

const profileService = new ProfileService()
const timesheetGeneratorService = new TimesheetGeneratorService()

export default {
    name: 'TimesheetTable',
    components: { DurationPicker },
    data () {
        return {
            currentWeekStart: currentWeekStart(), // FIXED
            timeEntries: [], 
            distributionProfile: {}, // FIXED
            showProfileTasksOnly: true, // FIXED
            previousPage: weeksInYear(), // FIXED
            currentPage: weeksInYear(), // FIXED
            isLoading: false, // FIXED
        }
    },
    created() {
        this.distributionProfile = profileService.getDistributionProfile(this.profile)
        this.initTimeEntries(this.projects)
    },
    computed: {
        ...mapFields([
            'userInfo',
            'projects',
            'profile',
            'softSubmit'
        ]),
        weekDates: function() { // FIXED
            const weekDates = []
            for (let i = 0; i < daysInWeek(); i++) {
                weekDates[i] = this.currentWeekStart.add(i, 'day')
            }
            return weekDates
        },
        projectsCount: function () { // FIXED
            return this.projects.length
        },
        totalPages: function () {
            return this.projectsCount * weeksInYear() * 2 // An year ahead and an year back
        },
        profileProjects: function () { // FIXED
            return this.projects.map(project => ({
                ...project,
                tasks: project.tasks.filter(task => isProfileTask(task, this.distributionProfile))
            }))
        },
        projectIds: function () { // FIXED
            return this.projects.map(project => project.id)
        },
        dayTotals: function () { // FIXED
            const dayTotals = []

            for (const dayIndex in this.weekDates) {
                dayTotals[dayIndex] = Object.values(this.timeEntries[dayIndex]).reduce((previous, current) => previous.add(current), zeroDuration())
            }

            return dayTotals
        },
        dayTotalsPerProject: function () { // FIXED ???
            const dayTotalsPerProject = []

            for (const dayIndex in this.weekDates) {
                const totalsForTheDayPerProject = this.projects
                    .map(project => ({
                        [project.id]: project.tasks
                                        .filter(task => !!this.timeEntries[dayIndex][task.id])
                                        .map(task => this.timeEntries[dayIndex][task.id])
                                        .reduce((previous, current) => previous.add(current), zeroDuration())
                    }))
                    .reduce((accumulator, value) => {
                        Object.entries(value).forEach(([key, value]) => {
                            accumulator[key] = value
                        })
                        return accumulator
                    }, [])

                dayTotalsPerProject[dayIndex] = totalsForTheDayPerProject
            }

            return dayTotalsPerProject
        },
        isTimesheetEmpty: function () { // FIXED
            return this.dayTotals.reduce((previous, current) => previous.add(current), zeroDuration()).asMinutes() == 0
        }
    },
    watch: {
        /* eslint-disable no-unused-vars */
        projects: function (_) { // FIXED
            this.initTimeEntries()
        }
    },
    methods: {
        toggle(row) { // FIXED
            this.$refs.table.toggleDetails(row)
        },
        initTimeEntries() { // FIXED
            const allProjectsTasks = getAllProjectsTasks(this.projects)

            for (const dayIndex in this.weekDates) {
                // Init time entries for the day
                if (!this.timeEntries[dayIndex]) {
                    this.$set(this.timeEntries, dayIndex, [])
                }

                // Add *new* tasks to the day time entries
                allProjectsTasks.forEach(taskId => {
                    if (!this.timeEntries[dayIndex][taskId]) {
                        this.$set(this.timeEntries[dayIndex], taskId, zeroDuration())
                    }
                })

                // Remove dangling tasks
                for (const taskId in this.timeEntries[dayIndex]) {
                    if (!allProjectsTasks.includes(taskId)) {
                        this.$delete(this.timeEntries[dayIndex], taskId)
                    }
                }
            }
        },
        populateTimeEntries(weekTimesheet) { // FIXED
            Object.entries(weekTimesheet).forEach(([dayIndex, tasks]) => {
                Object.entries(tasks).forEach(([taskId, duration]) => {
                    if (!this.timeEntries[dayIndex][taskId]) {
                        console.error(`Cannot find task ${taskId} for day ${dayIndex}`)
                    }
                    else {
                        this.timeEntries[dayIndex][taskId] = duration
                    }
                })
            })
        },
        getTaskProjectId(taskId) { // FIXED
            const [ projectId ] = this.projects
                .filter(project => project.tasks.filter(task => task.id === taskId).length)
                .map(project => project.id)
            return projectId
        },
        randomize() { // FIXED
            this.isLoading = true
            this.reset()
            const generatedTimesheet = timesheetGeneratorService.generateTimesheet(this.distributionProfile, this.profileProjects)
            console.error(generatedTimesheet)
            this.populateTimeEntries(generatedTimesheet)
            this.$buefy.toast.open('Successfully randomized that sh*t 🧐')
            this.isLoading = false
        },
        reset() { // FIXED
            Object.entries(this.timeEntries).forEach(([dayIndex, tasks]) => {
                for (const taskId in tasks) {
                    this.timeEntries[dayIndex][taskId] = zeroDuration()
                }
            })
        },
        async submit() { // FIXED
            this.isLoading = true
            const clockifyEntries = []
            
            this.weekDates.forEach((_, dayIndex) => {
                const dayEntries = this.createClockifyTimeEntries(dayIndex)
                clockifyEntries.push(...dayEntries)
            })

            await this.submitClockifyEntries(clockifyEntries)
            this.isLoading = false
        },
        createClockifyTimeEntries(dayIndex) {
            const clockifyDayEntries = []

            const dayEntries = getDayEntries(dayIndex, this.timeEntries)

            let timeToStartNextEntry = timeToStartEntries(this.currentWeekStart, dayIndex, 8) // Start at 08:00 UTC // TODO: Read Clockify settings

            Object.entries(dayEntries).forEach(([taskId, duration]) => {
                const start = timeToStartNextEntry
                const end = start.add(duration.asMinutes(), 'minute')
                const projectId = this.getTaskProjectId(taskId)
                const clockifyEntry = this.$clockify.timeEntry(start, end, projectId, taskId)
                clockifyDayEntries.push(clockifyEntry)
                timeToStartNextEntry = end
            })

            return clockifyDayEntries
        },
        async submitClockifyEntries(clockifyEntries) { // FIXED
            try {
                for (const timeEntry of clockifyEntries) {
                    await this.$clockify.createTimeEntry(this.userInfo.activeWorkspace, timeEntry)
                }
                
                if (!this.softSubmit) {
                    await this.$clockify.submitApprovalRequest(this.userInfo.activeWorkspace, this.userInfo.id, this.currentWeekStart)
                    this.openSnackbar('Your timesheet has been successfully submitted for approval', 'is-success')
                } else {
                    this.openSnackbar('Your time entries have been successfully created', 'is-success')
                }
            } catch (err) {
                this.openSnackbar('Error occurred during timesheet submission, please check status in the Clockify App', 'is-danger')
                console.error(err)
            } finally {
                this.isLoading = false
            }
        },
        openSnackbar(message, type) { // FIXED
            this.$buefy.snackbar.open({ message, type, position: 'is-top', actionText: 'OK', indefinite: true })
        },
        onPageChange(currentPage) { // FIXED
            this.reset()
            const weekAheadOrBehind = currentPage - this.previousPage
            this.currentWeekStart = this.currentWeekStart.add(weekAheadOrBehind, 'week')
            this.previousPage = currentPage
        }
    },
    filters: {
        weekday: date => date.format('dddd'),
        fulldate: date => date.format('ddd, MMM D'),
        hoursCount: date => date.format('H:mm')
    }
}
</script>
