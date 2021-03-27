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
                0:15
            </b-table-column>

            <b-table-column label="Total" centered v-slot="props">
                <span style="display:none">{{ props.row.name }}</span>
                <span :class="
                        [
                            'tag',
                            {'is-danger': false },
                            {'is-success': true }
                        ]">
                    8:00
                </span>
            </b-table-column>

            <template slot="detail" slot-scope="props">
                <tr v-for="task in props.row.tasks" :key="task.id">
                    <td></td>
                    <td>{{ task.name }}</td>
                    <td class="has-text-centered">
                        <b-field label="" class="ml-4 mr-4">
                            <b-timepicker
                                placeholder=""
                                hour-format="24"
                                icon="clock"
                                size="is-small"
                                :incrementMinutes="15"
                                :incrementHours="1"
                                >
                            </b-timepicker>
                        </b-field>
                    </td>
                    <td class="has-text-centered">
                        <b-field label="" class="ml-4 mr-4">
                            <b-timepicker
                                placeholder=""
                                hour-format="24"
                                icon="clock"
                                size="is-small"
                                :incrementMinutes="15"
                                :incrementHours="1"
                                >
                            </b-timepicker>
                        </b-field>
                    </td>
                    <td class="has-text-centered">
                        <b-field label="" class="ml-4 mr-4">
                            <b-timepicker
                                placeholder=""
                                hour-format="24"
                                icon="clock"
                                size="is-small"
                                :incrementMinutes="15"
                                :incrementHours="1"
                                >
                            </b-timepicker>
                        </b-field>
                    </td>
                    <td class="has-text-centered">
                        <b-field label="" class="ml-4 mr-4">
                            <b-timepicker
                                placeholder=""
                                hour-format="24"
                                icon="clock"
                                size="is-small"
                                :incrementMinutes="15"
                                :incrementHours="1"
                                >
                            </b-timepicker>
                        </b-field>
                    </td>
                    <td class="has-text-centered">
                        <b-field label="" class="ml-4 mr-4">
                            <b-timepicker
                                placeholder=""
                                hour-format="24"
                                icon="clock"
                                size="is-small"
                                :incrementMinutes="15"
                                :incrementHours="1"
                                >
                            </b-timepicker>
                        </b-field>
                    </td>
                    <td class="has-text-centered">
                        <b-field label="" class="ml-4 mr-4">
                            <b-timepicker
                                placeholder=""
                                hour-format="24"
                                icon="clock"
                                size="is-small"
                                :incrementMinutes="15"
                                :incrementHours="1"
                                >
                            </b-timepicker>
                        </b-field>
                    </td>
                    <td class="has-text-centered">
                        <b-field label="" class="ml-4 mr-4">
                            <b-timepicker
                                placeholder=""
                                hour-format="24"
                                icon="clock"
                                size="is-small"
                                :incrementMinutes="15"
                                :incrementHours="1"
                                >
                            </b-timepicker>
                        </b-field>
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
  </section>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import dayjs from 'dayjs'
import ProfileService from '../services/profile-service'

const profileService = new ProfileService()

export default {
    name: 'TimesheetTable',
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
            capexOpexDistribution: {},
            showProfileTasksOnly: true
        }
    },
    created() {
        this.weekDates = this.getWeekDates()
        this.capexOpexDistribution = profileService.getCapexOpexDistribution(this.profile)
    },
    methods: {
        toggle(row) {
            this.$refs.table.toggleDetails(row)
        },
        getWeekDates() {
            return Array.from({length: 7}, (_, i) => i + 1)
                .map(i => dayjs().day(i))
        },
        isProfileTask(task) {
            for (let i = 0; i < this.capexOpexDistribution.tasks.length; i++) {
                if (task.name.includes(this.capexOpexDistribution.tasks[i].name)) {
                    return true
                }
            }
            return false
        }
    }
}
</script>
