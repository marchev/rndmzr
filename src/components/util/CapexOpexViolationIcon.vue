<template>
    <span class="pt-1" :class="iconClass">
        <b-tooltip class="capex-opex-tooltip" type="is-warning">
            <template v-slot:content>
                <div>
                    <span class="semi-bold">Expected</span>
                    CAPEX: <span class="semi-bold">{{ expectedTotalPerType.capex | hoursCount }}</span>
                    OPEX: <span class="semi-bold">{{ expectedTotalPerType.opex | hoursCount }}</span>
                </div>
                <div>
                    <span class="semi-bold">Actual</span>
                    CAPEX: <span class="semi-bold">{{ actualTotalPerType.capex | hoursCount }}</span>
                    OPEX: <span class="semi-bold">{{ actualTotalPerType.opex | hoursCount }}</span>
                </div>
            </template>
            <b-icon
                type="is-danger"
                icon="exclamation-circle"
                size="is-small"
                multilined>
            </b-icon>
        </b-tooltip>
    </span>
</template>


<style lang="scss">
span.capex-opex-violation-visible {
    visibility: visible;
}

span.capex-opex-violation-hidden {
    visibility: hidden;
}
</style>

<script>
import { mapFields } from 'vuex-map-fields'
import { zeroDuration, daysInWeek } from '@/helpers/time-helpers'
import { findDayOffTask, findTrainingTask } from '@/helpers/timesheet-helpers'
import ProfileService from '@/services/profile-service'

import filters from '@/components/mixins/filters-mixin'
import projects from '@/components/mixins/projects-mixin'

const profileService = new ProfileService()

export default {
    name: 'CapexOpexViolationIcon',
    props: {
        dayIndex: {
            type: Number,
            require: true
        },
        dayTotal: {
            type: Object,
            required: true
        },
        timeEntry: {
            type: Array,
            required: true
        }
    },
    mixins: [ filters, projects ],
    created() {
        this.initCapexOpexRatioViolations()
    },
    computed: {
        ...mapFields([
            'capexOpexViolationMode',
            'capexOpexViolationThreshold',
            'capexOpexRatioViolations'
        ]),
        expectedTotalPerType: function () {
            return profileService.getExpectedDailyDistribution(this.profile, this.dayTotal)
        },
        actualTotalPerType: function()  {
            if (!this.timeEntry) {
                return { capex: zeroDuration(), opex: zeroDuration() }
            }

            return Object.entries(this.timeEntry).reduce((actualCapexOpex, [taskId, duration]) => {
                const [taskType] = this.allTasks.filter(task => task.id === taskId).map(task => task.type)
                if (taskType === 'capex') {
                    actualCapexOpex.capex = actualCapexOpex.capex.add(duration)
                } else {
                    actualCapexOpex.opex = actualCapexOpex.opex.add(duration)
                }
                return actualCapexOpex
            }, { capex: zeroDuration(), opex: zeroDuration() })
        },
        isViolation: function() {
            if (this.isWholeDayTraining || this.isWholeDayOff) {
                return false
            }

            const allowedDeviation = this.capexOpexViolationThreshold / 100 * this.dayTotal.asMinutes()
            const actualCapexMinutes = this.actualTotalPerType.capex.asMinutes()
            const expectedCapexMinutes = this.expectedTotalPerType.capex.asMinutes()
            const lessThanThreshold = actualCapexMinutes < (expectedCapexMinutes - allowedDeviation)
            const greaterThanThreshold = actualCapexMinutes > (expectedCapexMinutes + allowedDeviation)
            return this.capexOpexViolationMode && (lessThanThreshold || greaterThanThreshold)
        },
        isWholeDayTraining: function () {
            const trainingTask = findTrainingTask(this.projects)
            if (!trainingTask) {
                return false
            }
            const trainingDuration = this.timeEntry[trainingTask.id]
            return trainingDuration && trainingDuration.asMinutes() === this.dayTotal.asMinutes()
        },
        isWholeDayOff: function() {
            const dayOffTask = findDayOffTask(this.projects)
            if (!dayOffTask) {
                return false
            }
            const dayOffDuration = this.timeEntry[dayOffTask.id]
            return dayOffDuration && dayOffDuration.asMinutes() === this.dayTotal.asMinutes()
        },
        iconClass: function() {
            return {
                'capex-opex-violation-visible': this.isViolation,
                'capex-opex-violation-hidden': !this.isViolation
            }
        }
    },
    methods: {
        initCapexOpexRatioViolations() {
            for (let dayIndex = 0; dayIndex < daysInWeek(); dayIndex++) {
                this.$set(this.capexOpexRatioViolations, dayIndex, false)
            }
        }
    },
    watch: {
        isViolation: function (newValue) {
            this.$set(this.capexOpexRatioViolations, this.dayIndex, newValue)
        }
    }
}
</script>