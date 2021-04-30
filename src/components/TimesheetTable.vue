<template>
  <section id="timesheet">
        <capex-opex-violation-message></capex-opex-violation-message>
        <div id="generator" class="generator mt-4 columns">
            <div class="column">
            <b-button @click="randomize()" :disabled="locked || timesheetLoading" class="mr-2 randomize">Randomize!</b-button>
            <b-button @click="resetClicked()" :disabled="locked || timesheetLoading" class="reset">Reset</b-button>
            </div>
            <div class="column has-text-right">
            <b-button @click="submit()" :disabled="isTimesheetEmpty || locked || timesheetLoading" type="is-danger">Submit</b-button>
            </div>
        </div>
        <b-table class="mb-6"
            :data="showProfileTasksOnly ? profileProjectsPlusTimeOff : projects"
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

            <b-table-column field="project" label="Project" width="380" v-slot="project">
                <span class="has-text-weight-bold">
                    {{ project.row.name }}
                </span>
            </b-table-column>

            <b-table-column v-for="(weekDate, index) in weekDates"
                :key="weekDate | weekday"
                :label="weekDate | fulldate"
                centered>

                <template #subheading>
                    <quick-actions
                        :timeEntry="timeEntries[index]"
                        :disabled="locked || timesheetLoading">
                    </quick-actions>
                </template>

                <template v-slot="project">
                    <b-tag class="project-hours-count has-text-weight-semibold">
                        {{ dayTotalsPerProject[index][project.row.id] | hoursCount }}
                    </b-tag>
                </template>
            </b-table-column>

            <template slot="detail" slot-scope="props">
                <tr v-for="task in props.row.tasks" :key="task.id">
                    <td>
                        <span class="tag is-light has-text-weight-semibold"
                              :class="getTaskTagClass(task)">
                            {{ task.type | uppercase }}
                        </span>
                    </td>
                    <td>{{ task.name | dropTaskPrefixSuffix }}</td>
                    <td v-for="(_, index) in weekDates" :key="index" class="has-text-centered timepicker-cell">
                        <duration-picker v-model="timeEntries[index][task.id]" :disabled="locked || timesheetLoading">
                        </duration-picker>
                    </td>
                </tr>
            </template>

            <template #footer>
                <th>
                    <div class="th-wrap is-numeric">&nbsp;</div>
                </th>
                <th>
                    <div id="total" class="th-wrap">Total:</div>
                </th>
                <th v-for="(_, dayIndex) in weekDates" :key="dayIndex">
                    <div class="th-wrap is-centered pl-5">
                        <span class="tag" :class="getDayTotalsTagClass(dayIndex)">
                            {{ dayTotals[dayIndex] | hoursCount }}
                        </span>
                        <capex-opex-violation-icon
                            :dayIndex="dayIndex"
                            :dayTotal="dayTotals[dayIndex]"
                            :timeEntry="timeEntries[dayIndex]">
                        </capex-opex-violation-icon>
                    </div>
                </th>
            </template>

            <template #top-left>
                <div id="profile-tasks-switch" class="has-text-weight-semibold">
                    <b-switch v-model="showProfileTasksOnly" type="is-link">Show profile tasks only</b-switch>
                </div>
                <span :class="
                        [
                            'tag',
                            'mt-1',
                            'ml-2',
                            'has-text-weight-semibold',
                            { 'is-light': status === 'UNSUBMITTED' },
                            { 'is-warning': status === 'PENDING' },
                            { 'is-success': status === 'APPROVED' }
                        ]">
                    {{ status }}
                </span>
                <b-icon
                    v-show="timesheetLoading"
                    class="mt-1 ml-2"
                    pack="fas"
                    icon="sync-alt"
                    size="is-small"
                    custom-class="fa-spin">
                </b-icon>
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

<style lang="scss">
html {
	scroll-behavior: smooth;
}

thead tr:first-of-type th {
    border: none;
}

tr.is-subheading th {
    padding-top: 0px;
}

.tag {
    cursor: default;
}

nav.pagination small {
    display:none;
}

td.timepicker-cell {
    padding: 8px 0px;
}

div.hidden-clear-button {
    visibility: hidden;
}

td.timepicker-cell:hover div.hidden-clear-button, button.clear-timepicker:hover {
    visibility: visible;
}

span.capex-opex-violation-visible {
    visibility: visible;
}

span.capex-opex-violation-hidden {
    visibility: hidden;
}

.semi-bold {
    font-weight: 600;
}

.capex-badge {
    background-color: #53599A !important;
    color: #fff !important;
}

.opex-badge {
    background-color: #D36135 !important;
    color: #fff !important;
}
</style>

<script>
import { mapFields } from 'vuex-map-fields'

import { currentWeekStart, weeksInYear, daysInWeek, zeroDuration } from '@/helpers/time-helpers'
import { getDayEntries, timeToStartEntries, convertToTimesheet } from '@/helpers/timesheet-helpers'
import ProfileService from '@/services/profile-service'
import TimesheetGeneratorService from '@/services/timesheet-generator-service'

import DurationPicker from '@/components/util/DurationPicker.vue'
import QuickActions from '@/components/util/QuickActions.vue'
import CapexOpexViolationIcon from '@/components/util/CapexOpexViolationIcon.vue'
import CapexOpexViolationMessage from '@/components/util/CapexOpexViolationMessage.vue'

import filters from '@/components/mixins/filters-mixin'
import projects from '@/components/mixins/projects-mixin'
import snackbar from '@/components/mixins/snackbar-mixin'

const profileService = new ProfileService()
const timesheetGeneratorService = new TimesheetGeneratorService()

export default {
    name: 'TimesheetTable',
    mixins: [ filters, projects, snackbar ],
    components: {
        DurationPicker,
        QuickActions,
        CapexOpexViolationIcon,
        CapexOpexViolationMessage
    },
    data () {
        return {
            currentWeekStart: currentWeekStart(),
            distributionProfile: {},
            showProfileTasksOnly: true,
            previousPage: weeksInYear(),
            currentPage: weeksInYear(),
            isLoading: false,
            timesheetLoading: false
        }
    },
    created() {
        this.validateProfile(this.profile)
        this.distributionProfile = profileService.getDistributionProfile(this.profile)
        this.initTimeEntries(this.projects)
    },
    computed: {
        ...mapFields([
            'userInfo',
            'timeEntries',
            'softSubmit',
            'overrideMode',
            'status',
            'capexOpexRatioViolations',
            'darkMode'
        ]),
        weekDates: function() {
            const weekDates = []
            for (let i = 0; i < daysInWeek(); i++) {
                weekDates[i] = this.currentWeekStart.add(i, 'day')
            }
            return weekDates
        },
        totalPages: function () {
            return this.projectsCount * weeksInYear() * 2 // An year ahead and an year back
        },
        dayTotals: function () {
            const dayTotals = []

            for (const dayIndex in this.weekDates) {
                dayTotals[dayIndex] = Object.values(this.timeEntries[dayIndex]).reduce((previous, current) => previous.add(current), zeroDuration())
            }

            return dayTotals
        },
        dayTotalsPerProject: function () { // TODO: Optimize implementation
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
        isTimesheetEmpty: function () {
            return this.dayTotals.reduce((previous, current) => previous.add(current), zeroDuration()).asMinutes() == 0
        },
        locked: function() {
            return this.status === 'PENDING' || this.status === 'APPROVED'
        }
    },
    watch: {
        /* eslint-disable no-unused-vars */
        projects: {
            immediate: true,
            handler: 'initTimeEntries'
        },
        currentWeekStart: {
            immediate: true,
            handler: 'fetchAndPopulateEntriesForTheWeek'
        },
        showProfileTasksOnly: function(newValue) {
            this.$bugsnag.leaveBreadcrumb('Show profile tasks only switch toggled', { newValue })
        }
    },
    methods: {
        validateProfile(profile) {
            if (!profile) {
                throw 'No profile has been configured'
            }
        },
        toggle(row) {
            this.$refs.table.toggleDetails(row)
        },
        initTimeEntries() {
            for (const dayIndex in this.weekDates) {
                // Init time entries for the day
                if (!this.timeEntries[dayIndex]) {
                    this.$set(this.timeEntries, dayIndex, [])
                }

                // Add *new* tasks to the day time entries
                this.allTaskIds.forEach(taskId => {
                    if (!this.timeEntries[dayIndex][taskId]) {
                        this.$set(this.timeEntries[dayIndex], taskId, zeroDuration())
                    }
                })

                // Remove dangling tasks
                for (const taskId in this.timeEntries[dayIndex]) {
                    if (!this.allTaskIds.includes(taskId)) {
                        this.$delete(this.timeEntries[dayIndex], taskId)
                    }
                }
            }
        },
        populateTimeEntries(weekTimesheet) {
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
        randomize() {
            this.$bugsnag.leaveBreadcrumb('Randomize! button clicked')
            this.reset()
            const generatedTimesheet = timesheetGeneratorService.generateTimesheet(this.distributionProfile, this.profileProjects)
            this.populateTimeEntries(generatedTimesheet)
            this.$bugsnag.leaveBreadcrumb('Populated randomized timesheet', { generatedTimesheet })
            this.$buefy.toast.open({
                message: 'Successfully randomized that sh*t 🧐',
                type: this.darkMode ? 'is-light' : 'is-dark',
                queue: false
            })
        },
        resetClicked() {
            this.$bugsnag.leaveBreadcrumb('Reset button clicked')
            this.reset()
        },
        reset() {
            Object.entries(this.timeEntries).forEach(([dayIndex, tasks]) => {
                for (const taskId in tasks) {
                    this.timeEntries[dayIndex][taskId] = zeroDuration()
                }
            })
        },
        async submit() {
            this.$bugsnag.leaveBreadcrumb('Submit button clicked')
            try {
                this.isLoading = true
                const clockifyEntries = []
                
                this.weekDates.forEach((_, dayIndex) => {
                    const dayEntries = this.createClockifyTimeEntries(dayIndex)
                    clockifyEntries.push(...dayEntries)
                })

                if (this.overrideMode) {
                    await this.purgeClockifyEntries()
                }
                await this.submitClockifyEntries(clockifyEntries)
                await this.fetchAndPopulateEntriesForTheWeek(this.currentWeekStart)

                if (!this.softSubmit) {
                    this.$panelbear.track('timesheet.hard_submit')
                    this.openSnackbar('Your timesheet has been successfully submitted for approval', 'is-success')
                } else {
                    this.$panelbear.track('timesheet.soft_submit')
                    this.openSnackbar('Your time entries have been successfully created', 'is-success')
                }
            } catch (err) {
                this.openSnackbar('Error occurred during timesheet submission, please check status in the Clockify App', 'is-danger')
                this.$bugsnag.notify(err)
                console.error(err)
            } finally {
                this.isLoading = false
            }
        },
        async purgeClockifyEntries() {
            const { entries } = await this.$clockify.getWeekEntries(this.workspace, this.userInfo.id, this.currentWeekStart)
            await Promise.all(entries.map(async entry => await this.$clockify.deleteTimeEntry(this.workspace, entry.id)))
            this.$bugsnag.leaveBreadcrumb('Purged existing Clockify entries')
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
        async submitClockifyEntries(clockifyEntries) {
            await Promise.all(clockifyEntries.map(async timeEntry => await this.$clockify.createTimeEntry(this.workspace, timeEntry)))
            this.$bugsnag.leaveBreadcrumb('Timesheet entries submitted to Clockify', { clockifyEntries })

            if (!this.softSubmit) {
                await this.$clockify.submitApprovalRequest(this.workspace, this.userInfo.id, this.currentWeekStart)
                this.$bugsnag.leaveBreadcrumb('Timesheet entries submitted for approval')
            }
        },
        async fetchAndPopulateEntriesForTheWeek(weekStart) {
            try {
                this.timesheetLoading = true
                if (Object.keys(this.userInfo).length === 0) {
                    await new Promise(_ => setTimeout(this.fetchAndPopulateEntriesForTheWeek.bind(null, weekStart), 100))
                }
                const { status, entries } = await this.$clockify.getWeekEntries(this.workspace, this.userInfo.id, weekStart)
                const entriesProjectIds = this.$clockify.getProjectIds(entries)
                await this.addMissingProjects(entriesProjectIds)
                this.status = status
                const timesheet = convertToTimesheet(entries, this.currentWeekStart)
                this.reset()
                this.populateTimeEntries(timesheet)
            } finally {
                this.timesheetLoading = false
            }
        },
        async addMissingProjects(projectIds) {
            await Promise.all(projectIds.map(async projectId => {
                if (this.projectIds.includes(projectId)) {
                    return // Project already exists
                }
                const project = await this.$clockify.findProjectById(this.workspace, projectId)
                if (!project) {
                    throw new Error(`Cannot find project with projectId ${projectId}`)
                }
                await this.addProjectToMyProjects(project)
            }))
        },
        onPageChange(currentPage) {
            const weekAheadOrBehind = currentPage - this.previousPage
            this.currentWeekStart = this.currentWeekStart.add(weekAheadOrBehind, 'week')
            this.previousPage = currentPage
        },
        getTaskTagClass(task) {
            return {
                'is-info': task.type === 'capex', // CAPEX = blue
                'is-warning': task.type === 'opex', // OPEX = yellow
            }
        },
        getDayTotalsTagClass(index) {
            return {
                'is-danger': index <= 4 && this.dayTotals[index].asHours() < 8,
                'is-success': index <= 4 && this.dayTotals[index].asHours() >= 8 && !this.capexOpexRatioViolations[index],
                'is-light': index > 4 && this.dayTotals[index].asMinutes() === 0,
                'is-warning': (index > 4 && this.dayTotals[index].asMinutes() > 0) || this.capexOpexRatioViolations[index]
            }
        }
    }
}
</script>
