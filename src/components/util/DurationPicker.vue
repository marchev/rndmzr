<template>
    <b-field label="">
        <!-- v-model="timeEntries[index][task.id]" -->
        <b-timepicker
            placeholder=""
            hour-format="24"
            icon="clock"
            size="is-small"
            :incrementMinutes="15"
            :incrementHours="1"
            v-model="buefyTimepickerBridge"
            >
        </b-timepicker>
    </b-field>
</template>

<script>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import objectSupport from 'dayjs/plugin/objectSupport'

dayjs.extend(objectSupport)
dayjs.extend(duration)

export default {
    name: 'DurationPicker',
    props: {
        'value': Object
    },
    created() {
        console.log(this.value)
    },
    computed: {
        buefyTimepickerBridge: {
            // Duration to JS Date
            get() {
                return dayjs({
                    hour: this.value.hours(),
                    minute: this.value.minutes()
                }).toDate()
            },
            // JS Date to Duration
            set(v) {
                this.$emit('input', dayjs.duration({
                        hours: v.getHours(),
                        minutes: v.getMinutes()
                }))
            }
        }
    }
}
</script>
