<template>
    <div class="datetime-display">
        <b-tooltip type="is-dark" append-to-body dashed v-if="isThisDateHoliday">
            <template v-slot:content>
                <div class="has-text-centered">
                    <div v-for="holiday in holidaysOnThisDate" :key="holiday.name">
                        {{ holiday.name }}
                    </div>
                </div>
            </template>
            {{ datetime | fulldate }}
        </b-tooltip>
        <span v-if="!isThisDateHoliday">
            {{ datetime | fulldate }}
        </span>
    </div>
</template>

<style lang="scss">
div.datetime-display {
    cursor: default;
}
</style>

<script>
import filters from '@/components/mixins/filters-mixin'
import { getPublicHolidaysOnDate } from '@/helpers/calendarific'

export default {
  name: 'HolidayTooltip',
  mixins: [ filters ],
  props: {
      datetime: {
          type: Object,
          require: true
      }
  },
  asyncComputed: {
    async holidaysOnThisDate () {
        return await getPublicHolidaysOnDate(this.datetime)
    },
    async isThisDateHoliday () {
        return this.holidaysOnThisDate === null ? false : this.holidaysOnThisDate.length > 0
    }
  }
}
</script>
