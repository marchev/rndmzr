<template>
    <div class="columns is-gapless timepicker-container" :class="{ 'is-zero': isZero }">
        <div class="column is-one-fifth">
            &nbsp;
        </div>
        <div class="column is-three-fifths">
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
                    :disabled="locked"
                    >
                </b-timepicker>
            </b-field>
        </div>
        <div v-show="!locked" class="column is-one-fifth hidden-clear-button">
            <button @click="reset" class="clear-timepicker delete is-small mt-2"></button>
        </div>
    </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import dayjs from '@/helpers/dayjs'

export default {
    name: 'DurationPicker',
    props: {
        'value': Object
    },
    computed: {
        ...mapFields([
            'status'
        ]),
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
        },
        locked: function() {
            return this.status === 'PENDING' || this.status === 'APPROVED'
        },
        isZero: function() {
            return this.value.asMinutes() == 0
        }
    },
    methods: {
        formatTime(time) {
            return dayjs(time).format('HH:mm')
        },
        reset() {
            this.buefyTimepickerBridge = dayjs().startOf('day').toDate() // Set to 00:00
        }
    }
}
</script>
