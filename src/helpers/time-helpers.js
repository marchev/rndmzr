import dayjs from './dayjs'

export function weeksInYear() {
    return dayjs().isoWeeksInYear()
}

export function daysInWeek() {
    return dayjs.weekdays().length
}

export function zeroDuration() {
    return dayjs.duration(0)
}

export function currentWeekStart() {
    const currentWeekStart = dayjs.utc().startOf('week')
    return currentWeekStart
}