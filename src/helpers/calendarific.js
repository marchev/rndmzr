import dayjs from './dayjs'
import axios from 'axios'
import { readFromCache, writeToCache } from './cache'

export const getPublicHolidays = async (year) => {
    if (year === undefined) {
        year = dayjs().year()
    }

    const holidaysCacheKey = `rndmzr-holidays-${year}`
    let cachedHolidays = readFromCache(holidaysCacheKey)
    if (cachedHolidays !== null) {
        return cachedHolidays
    }

    let calendarificURL = `https://calendarific.com/api/v2/holidays?year=${year}&country=BG&type=national&api_key=697c31704a7da80489b4c747aa2f524bc6fc87cb`

    const holidaysResponse = await axios.get(calendarificURL)
    const holidays = holidaysResponse.data.response.holidays
    /** Fix for duplicate holidays returned by calendarific */
    const seen = new Set()
    const holidaysNoDuplicates = holidays.filter(holiday => {
        const duplicate = seen.has(holiday.name)
        seen.add(holiday.name)
        return !duplicate
    })

    writeToCache(holidaysCacheKey, holidaysNoDuplicates)
    return holidaysNoDuplicates
}

export const getPublicHolidaysOnDate = async (date) => {
    const year = date.year()
    const publicHolidays = await getPublicHolidays(year)
    return publicHolidays
        .filter(publicHoliday => publicHoliday.date.iso === date.format('YYYY-MM-DD'))
}

export const isPublicHoliday = async (date) => {
    return (await getPublicHolidaysOnDate(date)).length > 0
}