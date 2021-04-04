import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import objectSupport from 'dayjs/plugin/objectSupport'
import utc from 'dayjs/plugin/utc'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(duration)
dayjs.extend(objectSupport)
dayjs.extend(utc)
dayjs.extend(isoWeeksInYear)
dayjs.extend(isLeapYear)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
    weekStart: 1
})

export default dayjs