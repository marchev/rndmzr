<template>
    <div class="block quick-actions" :class="{ disabled }">
        <b-tooltip label="Day off" position="is-top" type="is-dark" class="quick-action-button">
            <a @click="bookDayOff()" :class="{ 'is-active': isWholeDayOff }">
                <b-icon
                    class="quick-action-icon"
                    icon="plane"
                    size="is-small"
                    type="is-dark">
                </b-icon>
            </a>
        </b-tooltip>
        <b-tooltip label="Training" position="is-top" type="is-dark" class="quick-action-button">
            <a @click="bookTraining()" :class="{ 'is-active': isWholeDayTraining }">
                <b-icon
                    class="quick-action-icon"
                    icon="user-graduate"
                    size="is-small"
                    type="is-dark">
                </b-icon>
            </a>
        </b-tooltip>
        <b-tooltip label="Reset" position="is-top" type="is-dark" class="quick-action-button">
            <a @click="resetDay()">
                <b-icon
                    class="quick-action-icon"
                    icon="times-circle"
                    size="is-small"
                    type="is-dark">
                </b-icon>
            </a>
        </b-tooltip>
    </div>
</template>

<style lang="scss">
div.quick-actions.disabled {
    a {
        cursor: not-allowed;
    }
}

span.quick-action-button {
    span.quick-action-icon {
        margin: 0px 4px !important;
    }
}
</style>

<script>
import dayjs from '@/helpers/dayjs'
import { zeroDuration } from '@/helpers/time-helpers'
import { findDayOffTask, findTrainingTask } from '@/helpers/timesheet-helpers'

import projects from '@/components/mixins/projects-mixin'

export default {
    name: 'QuickActions',
    props: {
        'timeEntry': Array,
        'disabled': Boolean
    },
    mixins: [ projects ],
    computed: {
        isWholeDayTraining: function () {
            const trainingTask = findTrainingTask(this.projects)
            if (!trainingTask) {
                return false
            }
            const trainingDuration = this.timeEntry[trainingTask.id]
            return trainingDuration && trainingDuration.asMinutes() === 480
        },
        isWholeDayOff: function () {
            const dayOffTask = findDayOffTask(this.projects)
            if (!dayOffTask) {
                return false
            }
            const dayOffDuration = this.timeEntry[dayOffTask.id]
            return dayOffDuration && dayOffDuration.asMinutes() === 480
        }
    },
    methods: {
        bookDayOff() {
            if (this.disabled) return
            this.resetDay()
            const dayOffTask = findDayOffTask(this.projects)
            this.$set(this.timeEntry, dayOffTask.id, dayjs.duration(8, 'hours'))
        },
        bookTraining() {
            if (this.disabled) return
            this.resetDay()
            const trainingTask = findTrainingTask(this.projects)
            this.$set(this.timeEntry, trainingTask.id, dayjs.duration(8, 'hours'))
        },
        resetDay() {
            if (this.disabled) return
            for (const [ taskId ] of Object.entries(this.timeEntry)) {
                this.timeEntry[taskId] = zeroDuration()
            }
        }
    }
}
</script>
