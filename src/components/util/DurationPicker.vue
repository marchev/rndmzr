<template>
    <span class="duration-picker">
        <b-field label="">
            <b-timepicker
                placeholder=""
                hour-format="24"
                icon="clock"
                size="is-small"
                :incrementMinutes="15"
                :incrementHours="1"
                v-model="buefyTimepickerBridge"
                :time-formatter="formatTime"
                >
            </b-timepicker>
        </b-field>
    </span>

</template>

<script>
import dayjs from '@/helpers/dayjs'

export default {
    name: 'DurationPicker',
    props: {
        'value': Object
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
    },
    methods: {
        formatTime(time) {
            return dayjs(time).format('HH:mm')
        }
    }
}
</script>
